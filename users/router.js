const express = require('express')
const router = express.Router()
const hander  = require('./hander')
const mongodb = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const jwt_key = 'keytoken'
const bcript = require('bcryptjs')
const {mongo_url}  =require('../config')

router.use(express.json())


router.get('/getpath', hander.getpath)

router.get('/users',async (req,res)=>{
     let client =await mongodb.connect(mongo_url,{useNewUrlParser:true,useUnifiedTopology:true
    }).catch(err=>{
         res.status(400)
     })
    let db = client.db('BUU')
    let user =await db.collection('users').find({}).toArray()
    .catch((err)=>{
        console.log(`Cannot find to Mongodb: ${err}`)
        res.status(500).json({error:err})
    })

    res.status(200).json(user)
})

router.post('/register',async (req,res)=>{
    let user = req.body.user
    let password = req.body.password
    let encode_pass = await bcript.hash(password,8)
    let object = {
        user:user,
        password:encode_pass
    }

    let client =await mongodb.connect(mongo_url,({useNewUrlParser:true,useUnifiedTopology:true}))
    .catch((err)=>{
        res.status(400)
    })
    let db = client.db('BUU')
    let r =await db.collection('users').insertOne(object)
    .catch((err)=>{
        res.status(400)
    })

    let result = { _id:object._id,
        user:object.user,
        password:object.password }
    res.status(201).json(result)
})

router.post('/sign-in',async (req,res)=>{
    let user =req.body.user
    let password = req.body.password

    let client =await  mongodb.connect(mongo_url,({useNewUrlParser:true,useUnifiedTopology:true}))
    .catch(err=>{
        res.status(400)
    })

    let db = client.db('BUU')
    let r = await db.collection('users').findOne({user:user})
    .catch(err=>{
        res.status(400)
    })

    if(!r){
        res.send('dont have user ')
    }


    let valid = await bcript.compare(password,r.password)
    if(!valid){
        res.status(401),json({error: "ํemail/password is incorrect"})
    }

    let token = await jwt.sign({
        id:r._id,
        user:r.user        
    },jwt_key
    
    )

    res.json({token:token})

})



const auth = async (req,res,next)=>{
    let token = req.header('Authorization')

    let decoded 
    try{
    let decoded = await jwt.verify(token,jwt_key)
    req.decoded =decoded
    next()

    }catch(err){
        console.log(`invalid token ${err}`)
        res.status(401).json({error:err})
        return
    }
}

router.get('/me',auth,async (req,res)=>{
    let user = req.decoded.user


    let client = await mongodb.connect(mongo_url,{useNewUrlParser:true,useUnifiedTopology:true})
    .catch(err=>{
        res.status(400)
    })

    let db = client.db('BUU')
    let r  = await db.collection('users').findOne({user:user})
    .catch((err)=>{
        console.log(`Cannot find to Mongodb: ${err}`)
        res.status(500).json({error:err})
    })


    if (!r ) {
        res.status(401).json({error: "data is not found"})
        return
    }
    delete r.password

    res.json(r)
})


module.exports = router