import jwt from 'jsonwebtoken';
import tokenBlacklistModel from '../models/blacklist.model.js';

async function authUser(req,res,next){
    const token =req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message:"token not provided."
        });
    }
    const isTokenBlacklist=await tokenBlacklistModel.findOne({token});

    if(isTokenBlacklist){
         return res.status(401).json({
            message:"Invalid token."
        });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
         return res.status(401).json({
            message:"Invalid token."
        });
    }

}

export default authUser;