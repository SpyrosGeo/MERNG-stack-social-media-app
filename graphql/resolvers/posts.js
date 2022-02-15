const {AuthenticationError} = require('apollo-server')
const Post = require("../../models/Post")

const checkAuth = require('../../utils/check-auth')

module.exports = {
    Query: {

        async getPosts() {
            try {
                const posts = await Post.find().sort({createdAt:-1}) //sort posts array with latest first.
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_,{postId}){
            try {
                const post = await Post.findById(postId)     
                if(post){
                    return post
                }else{
                    throw new Error('Post not found')
                }
            } catch (error) {
               throw new Error(error)
            }
        }
    },
    Mutation:{
        async createPost(_,{body},context){
            const user = checkAuth(context)// if we get here there is no error so no need to check further
            const newPost = new Post({
                body,
                user:user.id,
                username:user.username,
                createdAt:new Date().toISOString()

            })
            const post = await newPost.save()
            return post;
        },
        async deletePost(_,{postId},context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId)
                //check that the specific user is the owneer of post
                if(user.username === post.username){
                    await post.delete()
                    return 'Post deleted successfully'
                }else{
                    throw new AuthenticationError('Action not allowed')
                }

            }catch(error){
                throw new Error(error)
            }
            
        }
    }
}