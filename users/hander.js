const hander = {}
hander.getpath = (req,res)=>{
    return res.status(200).json({path:'/user/..'})
}

module.exports = hander