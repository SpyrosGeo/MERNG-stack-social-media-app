const {gql} = require('apollo-server')
// write graphql queries
//! means required
 module.exports = gql`
    type Post{
        id:ID!
        body:String!
        createdAt:String!
        username:String!
    }
    type Query{
        getPosts:[Post]
    }
 
 
 `