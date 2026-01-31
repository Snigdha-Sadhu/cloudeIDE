import jwt from'jsonwebtoken';
export const auth=(req,res,next)=>{
  
  console.log('Headers:', req.headers);

    const header=req.header('Authorization');
    if(!header) return res.status(401).json({msg:'No token'});
     const token=header.split(' ')[1];
    if(!token) return res.status(401).json({msg:'No token'});
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded.user;
        console.log(req.user);
        next();
    }catch(err){
      res.status(401).json({msg:'Token invalid'})
    }
}