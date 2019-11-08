const express =require('express')
const app = express()
const skateboard = require('./skateboard/router')
const users = require('./users/router')

app.use('/skateboard',skateboard)
app.use('/users',users)

app.use(express.json())
app.get('/get',(req,res)=>{
    res.status(200).json({status : 200})
})

module.exports = app
