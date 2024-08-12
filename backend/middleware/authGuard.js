const jwt = require('jsonwebtoken');



const authGuard = (req, res, next) => {
    // Check if auth header is present
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing!",
      });
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing!",
      });
    }
  
    // Verify token and set user information in the request
    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedData;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token!",
      });
    }
  };
  
  module.exports = authGuard;
  


const authGuardAdmin = (req,res,next) => {
    
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.json({
            success : false,
            message : "Authorization header missing!"
        })
    }

   
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.json({
            success : false,
            message : "Token missing!"
        })
    }

    // verify token
    try {
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodedData;
        if(!req.user.isAdmin){
            return res.json({
                success : false,
                message : "Permission denied!"
            })
        }
        next();
        
    } catch (error) {
        res.json({
            success : false,
            message : "Invalid token!"
        })
    }
    
};


module.exports = {
    authGuard,
    authGuardAdmin
};