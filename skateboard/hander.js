let hander = {}
hander.getpath = (req,res)=>{
    return res.json({path:'/skateboard/..'})
}

hander.deck = (req,res)=>{
    return res.status(200).json({deck:'real'})
}




module.exports = hander