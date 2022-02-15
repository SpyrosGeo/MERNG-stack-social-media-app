const { UserInputError, AuthenticationError } = require('apollo-server')
const Post = require('../../models/Post')
const User = require('../../models/User')
const checkAuth = require('../../utils/check-auth')




module.exports = {
    Mutation:{
        async createComment(_,{postId,body},context){
            const {username} = checkAuth(context)
            if(body.trim()===""){
                throw new UserInputError('Empty comment',{
                    errors:{
                        body:'Comment body must not be empty'
                    }
                })
            }
            const post = await Post.findById(postId)
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post;
            }else {
                throw new UserInputError('Post not found')
            }
            
        },
        async deleteComment(_,{postId,commentId},context){
            const {username} = checkAuth(context)
            const post = await Post.findById(postId) 
            if(post){
                //find the index of the specific error we want deleted and check if its id is the id of the comment we want deleted
                const commentIndex = post.comments.findIndex(c=> c.id===commentId)
                //check if the owners username is the same username assosiated with 
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex,1)//removes  the comment with the specific index
                    await post.save()
                    return post
                }else{
                    throw new AuthenticationError('Action not allowed')
                }
            }else {
                throw new UserInputError('Post not Found')
            }
        }
    }
}