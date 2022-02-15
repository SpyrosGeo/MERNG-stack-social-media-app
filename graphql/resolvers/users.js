const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const {validateRegisterInput} = require('../../utils/validators')
const  { UserInputError } = require('apollo-server')
const User = require('../../models/User')
const {SECRET} = require('../../config.js')

module.exports = {
    Mutation: {
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

            const token = jwt.sign({
                id:res.id,
                emai:res.email,
                username:res.username,
            },SECRET,{expiresIn:'1h'})
            return {
                ...res._doc,
                id:res._id,
                token
            }

        } //parent gives you the input from the last step useful in multiple resolvers

    }
}