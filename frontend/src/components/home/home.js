import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:4000/');

const Home = ({ data }) => {
  const [msg, setMsg] = useState('');
  const [inputValue, setInputValue] = useState('');
  const msgContainerRef = useRef(null);
  const [error, setError] = useState();


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


  return (
    <>
      <div className="container">
        <div className="msgContainer" ref={msgContainerRef}></div>
        <div className="sendMsg">
          <input type="text" className="sendMsgInp" value={inputValue} onChange={handleChange} />
          <button className="sendBtn" onClick={submit}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
