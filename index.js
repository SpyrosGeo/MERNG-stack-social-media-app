const { ApolloServer}  =require('apollo-server')
const gql = require('graphql-tag');
const mongoose = require('mongoose')

const {MONGODB} = require('./config.js')


// write graphql queries 
//! means required
const typeDefs = gql`
    type Query{
        sayHi:String! 
    }
` 


const resolvers = {
    Query:{
        sayHi: () => 'hello world'
        
    }
}



const server = new ApolloServer({
    typeDefs,
    resolvers,
    
})

//db connection and then serving at PORT 5000
mongoose.connect(MONGODB,{useNewUrlParser:true}).then(
    ()=>{
        console.log('connected to db')
        return server.listen({port:5000})
    }
).then(res=>{
    console.log(`server running at ${res.url}`)
})