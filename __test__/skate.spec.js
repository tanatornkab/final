const chai = require('chai')
const request = require('supertest')
const app = require('../app')
chai.should()


describe('GET/ skate',()=>{
    it ('test api get skate',(done)=>{
        request(app).get('/skateboard/deck')
        .expect(200)
        .end((err,res)=>{
            res.body.should.to.be.an('object')
            done()
        })
    })
})

describe('POST /students',()=>{
    it ('should return 201 ',(done)=>{
        request(app).post('/skateboard/deck')
        .send({ deck:"Unknown",size:"Unknown" })
        .set('Accept', 'application/json')
        .expect(200,done)
    })
})



