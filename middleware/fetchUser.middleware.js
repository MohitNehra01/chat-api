const AppError = require('../utils/error.utils')
const JWT = require('jsonwebtoken')

const fetchUser = async (req, res,next)=>{
    const auth_token = req.header('auth_token') || null;

    if(!auth_token){
        return next(new AppError('Unauthenticated',401))
    }

    try {
          const payload = await JWT.verify(auth_token , process.env.JWT_SECRET)

          req.user = payload;
          next();
    } catch (error) {
        return next(new AppError(error.message , 500));
    }
}

module.exports = fetchUser