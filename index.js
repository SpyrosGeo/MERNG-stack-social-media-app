const { ApolloServer,}  =require('apollo-server')
// const {PubSub} = require('graphql-subscriptions')
const mongoose = require('mongoose')

const {MONGODB} = require('./config.js')
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')



// const pubsub = new PubSub()


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>({req,}) //take the req body and forward it to the context
    // context:({req})=>({req,pubsub}) //take the req body and forward it to the context
    
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