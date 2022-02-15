const {model,Schema} = require('mongoose')


const postSchema = new Schema({
    body:String,
    username:String,
    createdAt: String,
    comments:[
        {
            body:String,
            username:String,
            createdAt:String,
        }
    ],
    likes:[
        {
            username:String,
            createdAt:String,

        }
    ],
    user:{
        type: Schema.Types.ObjectId, //connect to user even though mongodb is nosql the ORM lets us do it
        ref:'users'
    }
})

module.exports = model('Post',postSchema)