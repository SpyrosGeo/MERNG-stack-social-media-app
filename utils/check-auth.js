const {AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../config')

module.exports = (context) =>{
    
    const authHeader = context.req.headers.authorization;
    if(authHeader) {
        //get token from header if header exists
        //token usually is in the form of Bearer .... so we have to split it to get the token
        const token = authHeader.split('Bearer ')[1] //don't forget the space in the end of bearer
        if(token) {
            try {
               const user = jwt.verify(token,SECRET) 
                return user;
            } catch (error) {
               throw new AuthenticationError('Invalid/Expired token') 
                
            }
        }
        throw new Error('Authentication Token must be "Bearer [token]"')

    }
    throw new Error ('Authorization header must be provided')
}