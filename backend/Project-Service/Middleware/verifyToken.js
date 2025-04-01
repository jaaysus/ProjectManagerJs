const jwt=require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    // res.send('fff');
    const token=req.headers['authorization'];
    // res.json(token);
    
    if (!token) {
        return res.status(403).json(token);
    }
    jwt.verify(token,'alae_secret_key',(err, decoded)=>{
        if (err) {
            return res.status(401).send('Token invalid');
        }
        req.user = decoded;
        console.log(req.user)
        next();
    });
};
module.exports=verifyToken;