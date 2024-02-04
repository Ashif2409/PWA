import Login from './components/login/login';
import Home from './components/home/home';
import Register from './components/register/reg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';

const App = () => {
  const [data, setData] = useState({});
  return <>
    <BrowserRouter>
  <Routes>
    <Route path='/' element={<Login setData={setData}/>}></Route>
    <Route path='/register' element={<Register/>}></Route>
   <Route path='/home' element={<Home data={data}/>}></Route>
  </Routes>
  </BrowserRouter>

  </>
}


export default App
