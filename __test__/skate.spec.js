const chai = require('chai')
const request = require('supertest')
const app = require('../app')
chai.should()


describe('GET/ student',()=>{
    it ('test api get skate',(done)=>{
        request(app).get('/skateboard/deck')
        .expect(200)
        .end((err,res)=>{
            res.body.should.to.be.an('object')
            done()
        })
    })
})




