const express = require('express')
const router = express.Router()
const hander = require('./hander')

const mongodb = require('mongodb').MongoClient
const { mongo_url } = require('../config')

router.use(express.json())
// router.get('/deck',hander.deck)
router.get('/getpath',hander.getpath)

router.get('/deck',async (req,res)=>{
    let client =await mongodb.connect(mongo_url,{useNewUrlParser:true,useUnifiedTopology:true
   }).catch(err=>{
        res.status(400)
    })
   let db = client.db('SKATEBOARD')
   let user =await db.collection('deck').find({}).toArray()
   .catch((err)=>{
       console.log(`Cannot find to Mongodb: ${err}`)
       res.status(500).json({error:err})
   })

   res.status(200).json(user)
})
router.post('/deck',async (req,res)=>{
    let name = req.body.name
    let size = req.body.size

    let object = {
        deck_name:name,
        deck_size:size
    }
    let client =await mongodb.connect(mongo_url,({useNewUrlParser:true,useUnifiedTopology:true}))
    .catch((err)=>{
        res.status(400)
    })
    let db = client.db('SKATEBOARD')
    let r =await db.collection('deck').insertOne(object)
    .catch((err)=>{
        res.status(400)
    })
    
    res.status(201).json(object)
})

module.exports = router