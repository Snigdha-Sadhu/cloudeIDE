import bcrypt from'bcryptjs'
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';
export const signup=async(req,res)=>{
    console.log(req.body);
     
    try{
        const{name,email,password}=req.body;
        if(!email || !password) return res.status(400).json({msg:'Email & Password required'});
    let user=await User.findOne({email});
    if(user) return res.status(400).json({msg:'User exists'});
    const salt=await bcrypt.genSalt(10);
    const passwordHash=await bcrypt.hash(password,salt);
    user=new User({name,email,passwordHash});
    await user.save();
    const token=jwt.sign({user:{id:user._id}},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });
    res.json({token,user:{id:user._id,name:user.name,email:user.email}});

    }catch(err){
        console.error(err);
        res.status(500).send('server error');
    }
};
export const login=async(req,res)=>{
    console.log(req.body);
  console.log("jwt",process.env.JWT_SECRET,)
    try{
          const {email,password}=req.body;
        if(!email||!password)return res.status(400).json({msg:'Email &password is required'});
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'user not found'});
        }
        console.log('User found:', user);
console.log('Entered password:', password);
console.log('Hashed password:', user.passwordHash);
    
        const isMatch=await bcrypt.compare(password,user.passwordHash);
    console.log(isMatch)
        if(!isMatch){
            return res.status(400).json({msg:"Invalid Credentials"});
        }
        const token=jwt.sign({user:{id:user._id}},process.env.JWT_SECRET,{expiresIn:'7d'});
       res.json({token,user:{id:user._id,name:user.name,email:user.email,}}) ;
      
    }catch(err){
        console.error(err);
        res.status(500).send('server error');
    }
}

export const getMe=async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-passwordHash');
        res.json(user);
    }catch(err){
        res.status(500).send('server error');
    }
};