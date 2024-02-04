
const mongoose = require('mongoose');
const express=require('express')
const cors=require('cors');
const app=express();
const multer = require('multer');

app.use(express.json())
app.use(express.urlencoded());
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploadFile', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;
  const fileName = req.body.fileName;
  console.log(uploadedFile + ''+ file)
  res.json({ file: uploadedFile, fileName: fileName });
});

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/register').then(()=>{
    console.log("connection with dbms succesfully");
  })

  }

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const User =  mongoose.model("User",userSchema);

  app.post('/reg',(req,res)=>{
   const {name,email,password}= req.body;
   User.findOne({email:email}).then((user)=>{
       if(user){
           res.send({message:"Account From this Email already existed"})
       }else{
           const user = new User({
            name,
            email,
            password
        })
        user.save().then(err=>{
            if(err){
                res.send(err)
            }else{
                res.send({message:"successfully register"})
            }
        })

       }

   })
   })
app.post('/',(req,res)=>{
    const {email,password}=req.body;
    User.findOne({email:email}).then((user)=>{
        if(user){
            if(password===user.password){
                res.send({message:"Login Succesfully",user:user})
            }else{
                res.send({message:"The Password you enter is incorrect"})
            }
        }else{
            res.send({message:"You are not register"})
        }
    })
})








  app.listen(9002,()=>{
    console.log("Connected succesfully to port 9002");
  })

