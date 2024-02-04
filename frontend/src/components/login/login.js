import React,{useState} from 'react'
import './login.css'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
const Login = ({setData}) => {
    const history=useNavigate();
    const [user, setUser] = useState({
        email:"",
        password:""
    })
    const handleChange = (e)=>{
        const {name,value}=e.target;
        setUser({
            ...user,
            [name]:value
        })
    }
    const changeLoc=()=>{
        history("/register");
    }
    const login=()=>{
        const {email,password}=user;
        if(user.email && user.password){
            axios.post("http://localhost:9002/",user)
            .then(res=>{
                if(res.data.user){
                    setData(res.data.user);
                    history("/home");
                }
            })
        }
    }
  return (
    <div className="login">
        <h1>Login</h1>
        <input type="email" name='email' value={user.email} onChange={handleChange} placeholder='Enter your email...' />
        <input type="password" name='password' value={user.password} onChange={handleChange} placeholder='Password' />
        <div className="btn" onClick={login}>Login</div>
        <p>Or</p>
        <div className="btn" onClick={()=>history("/register")}>
            Register</div>
    </div>
  )
}

export default Login