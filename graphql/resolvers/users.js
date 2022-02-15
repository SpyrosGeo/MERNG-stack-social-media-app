const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const {validateRegisterInput,validateLoginInput} = require('../../utils/validators')
const  { UserInputError } = require('apollo-server')
const User = require('../../models/User')
const {SECRET} = require('../../config.js')


function generateToken(user){
    
return jwt.sign({
                id:user.id,
                emai:user.email,
                username:user.username,
            },SECRET,{expiresIn:'1h'})
}
module.exports = {
    Mutation: {
        async login (_,{username,password}){ //no need to destructure from type as below because of the mutation in typedefs
            const {errors,valid} = validateLoginInput(username,password)
            const user = await User.findOne({username})
            if(!valid){
                throw new UserInputError('Errors',{errors})
            }
            if(!user){
                errors.general = 'User not Found'
                throw new UserInputError('User not Found',{errors})
            }

            const match = await bcrypt.compare(password,user.password)
            if (!match){
                errors.general = 'Wrong Credentials'
                throw new UserInputError('Wrong Credentials',{errors})
            }
            const token = generateToken(user) 
            return {
                ...user._doc,
                id:user._id,
                token
            }
        },
        async register(parent, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword
            }
        }, context, info) {
            // Validate user data
            const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword)
            if(!valid){
                throw new UserInputError('Errors',{errors})
            }
            //Make sure user does not already exist
            const user = await User.findOne({
                username
            })
            if (user){
                throw new UserInputError('Username already exists',{
                    errors:{
                        username:'This username is taken'
                    }
                })
            }
            // hash password and create an auth token.
            password = await bcrypt.hash(password,12)//12 is the number of rounds for the hashing

            //create the new user with the data tha we received from the form
            const newUser = new User({
                email,
                username,
                password,
                createdAt:new Date().toISOString()
            })
            //saves the new user to the db
            const res = await newUser.save()

            const token = generateToken(res)
            return {
                ...res._doc,
                id:res._id,
                token
            }

        } //parent gives you the input from the last step useful in multiple resolvers

    }
}