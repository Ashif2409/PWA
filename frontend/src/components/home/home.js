import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:4000/');

const Home = ({ data }) => {
  const [msg, setMsg] = useState('');
  const [inputValue, setInputValue] = useState('');
  const msgContainerRef = useRef(null);
  const [file, setFile] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [error, setError] = useState();

  function handleChanges(event) {
    setFile(event.target.files[0]);
  }
  const handleDownload = (file, fileName) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createMessageContainer = (fileName) => {
    const msgContainer = document.createElement('div');
    msgContainer.classList.add('middle');
  
    const messageText = document.createElement('span');
  
    
    const fileType = fileName.split('.').pop().toLowerCase();
    if (fileType === 'mp3' || fileType === 'wav' || fileType === 'ogg') {
      messageText.textContent = `Audio file ${fileName} has been shared.`;
    } else if (fileType === 'mp4' || fileType === 'webm' || fileType === 'mov') {
      messageText.textContent = `Video file ${fileName} has been shared.`;
    } else {
      messageText.textContent = `File ${fileName} has been shared.`;
    }
  
    msgContainer.appendChild(messageText);
  
    return msgContainer;
  };

  useEffect(() => {
    socket.emit('userJoin', data);
    socket.on('userHasJoined', (data) => {
      const existingMessages = document.querySelectorAll('.middle');
      const messageExists = Array.from(existingMessages).some((message) => {
        return message.innerText.includes(`${data.user.name} has joined.`);
      });
      if (!messageExists) {
        const msgContainer = document.createElement('div');
        msgContainer.innerText = `${data.user.name} has joined.`;
        msgContainer.classList.add('middle');
        msgContainerRef.current.appendChild(msgContainer);
      }
    });
    socket.on('left', name => {
      append(`${name.name} Left the chat`, 'left');
    })
    return () => {
      socket.off('userHasJoined');
    };
  }, [data]);

  
  useEffect(() => {
    socket.on('receiveAudio', ({ file, fileName }) => {

      const audio = document.createElement('audio');
      audio.src = file;
      audio.controls = true;
      const msgContainer = createMessageContainer(fileName);
      msgContainer.appendChild(audio);
      msgContainerRef.current.appendChild(msgContainer);
    });

    // socket.on('receiveVideo', ({ file, fileName }) => {
    //   const video = document.createElement('video');
    //   video.src = file;
    //   video.controls = true;

    //   const msgContainer = createMessageContainer(fileName);
    //   msgContainer.appendChild(video);
    //   msgContainerRef.current.appendChild(msgContainer);
    // });

    socket.on('receiveFile', ({ file, fileName }) => {
      const message = `${fileName} has been shared. Download: `;

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = file;
      downloadLink.target = '_blank'; 
      downloadLink.rel = 'noopener noreferrer'; 
      downloadLink.textContent = fileName;

     
      downloadLink.addEventListener('click', (event) => {
        event.preventDefault();
        handleDownload(file, fileName);
      });

      const msgContainer = document.createElement('div');
      msgContainer.classList.add('middle');

      msgContainer.appendChild(document.createTextNode(message));
      msgContainer.appendChild(downloadLink);

      msgContainerRef.current.appendChild(msgContainer);
    });

    return () => {
      socket.off('receiveFile');
      socket.off('receiveVideo');
      socket.off('receiveAudio');
    };
  }, []);


  const submit = () => {
    const message = msg;
    socket.emit('send', message);
    append(`You: ${message}`, 'right');
    setInputValue('');
  };

  useEffect(() => {
    socket.on('recieve', (data) => {
      append(`${data.name.name}: ${data.message}`, 'left');
    });

    return () => {
      socket.off('recieve');
    };
  }, []);

  const handleChange = (e) => {
    setMsg(e.target.value);
    setInputValue(e.target.value);
  };

  const append = (message, pos) => {
    const msgContainer = document.createElement('div');
    msgContainer.innerText = message;
    msgContainer.classList.add('message');
    msgContainer.classList.add(pos);
    msgContainerRef.current.appendChild(msgContainer);
  };


  function handleSubmit(event) {

    event.preventDefault();
    const url = 'http://localhost:9002/uploadFile';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config)
      .then((response) => {
        console.log(response.data);
        setUploadedFile(response.data.file);
        socket.emit('sendFile', { file: response.data.file, fileName: file.name });
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
        setError(error);
      });
  }


  return (
    <>
      <div className="container">
        <div className="msgContainer" ref={msgContainerRef}></div>
        <div className="sendMsg">
          <input type="text" className="sendMsgInp" value={inputValue} onChange={handleChange} />
          <button className="sendBtn" onClick={submit}>
            Send
          </button>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChanges} />
            <button type="submit">Upload</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
