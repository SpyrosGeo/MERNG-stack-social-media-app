const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentsResolvers = require('./comments')


module.exports = {
    //every time a query or mutation for posts runs this triggers and calculates the count for likes and comments in each post
    Post:{
        likeCount(parent){
            return parent.likes.length
        },
        commentCount:(parent) => parent.comments.length
    },
    Query:{
        ...postsResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation

    },
    // Subscription:{
    //     ...postsResolvers.Subscription
    // }
}