import React,{useState} from 'react'
import './reg.css'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
const Register = () => {
  const history=useNavigate();
  const [user, setUser] = useState({
    name:"",
    email:"",
    password:"",
    reEnterPassword:""

})
const handleChange = (e)=>{
    const {name,value}=e.target;
    setUser({
        ...user,
        [name]:value
    })
}

const register = ()=>{
  const {name,email,password,reEnterPassword}=user;
  if(user.name && user.email && user.password && user.reEnterPassword===user.password){
    axios.post("http://localhost:9002/reg",user)
    .then(  res =>{
      console.log("Successfully Send ")
      history('/home')
    })
  }else alert("Invalid input")
}
return (
<div className="register">
    <h1>Register</h1>
    <input type="name" name='name' value={user.name} onChange={handleChange} placeholder='Enter your name...' />
    <input type="email" name='email' value={user.email} onChange={handleChange} placeholder='Enter your email...' />
    <input type="password" name='password' value={user.password} onChange={handleChange} placeholder='Password' />
    <input type="password" name='reEnterPassword' value={user.reEnterPassword} onChange={handleChange} placeholder='ReEnter Your Password' />
    <div className="btn" onClick={register}>Register</div>
    <p>Or</p>
    <div className="btn" onClick={()=>history("/")}>Login</div>
</div>
)
}

export default Register