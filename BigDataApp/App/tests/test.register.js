var assert = require('assert');
process.env.NODE_ENV = 'test';
var chai = require('chai'); 
var expect  = require("chai").expect;
var chaiHttp = require('chai-http');
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:4501");
var pg= require('pg')
var config = require('../database/dataFile').Config;
var pool = new pg.Pool(config);
var db = require('../server/db');
let transaction_id='';

const userCredentials = {
  username: 'testuser@gmail.com', 
  password: 'test'
}

const transaction_details = {
  "description" : "tea",
  "merchant" : "house",
  "amount" : "2.34",
  "date" : "09/25/2018",
  "category" : "food"
}
const transaction_details_update = {
  "description" : "coffee",
  "merchant" : "house",
  "amount" : "2.34",
  "date" : "09/25/2018",
  "category" : "food"
}

describe ("User",function(){
  before(function(done){
      server
      .post('/api/user/register')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userCredentials)
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
          done();
      });
  });

  describe("Transaction",function(){

    before(function(done){
      server
      .post('/api/transaction')
      .set('content-type', 'application/x-www-form-urlencoded')
      .auth('testuser@gmail.com', 'test')
      .send(transaction_details)
      .expect("Content-type",/json/)
      .expect(201)
      .end(function(err,res){
        console.log(res.body);
          done();
      });
    });

    
    describe("GET /transaction",function(){
      it("return the transaction",function(done){
        server
        .get('/api/transaction')
        .auth('testuser@gmail.com', 'test')
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          console.log(res.body[0].id)
          transaction_id = res.body[0].id
          res.status.should.equal(200);
            done();
        });
      });
    });

    describe("GET /transaction",function(){
      it("return the transaction",function(done){
        server
        .put('/api/transaction/'+transaction_id)
        .auth('testuser@gmail.com', 'test')
        .send(transaction_details_update)
        .expect("Content-type",/json/)
        .expect(201)
        .end(function(err,res){
          res.status.should.equal(201);
            done();
        });
      });
    });

      after(function(done){
        server
        .del('/api/transaction/'+transaction_id)
        .send(userCredentials)
        .auth('testuser@gmail.com', 'test')
        .set('content-type', 'application/x-www-form-urlencoded')
        .expect("Content-type",/json/)
        .expect(204)
        .end(function(err,res){
          console.log(res.body)
            done();
        });
      });
  });

  describe("GET /",function(){
    it("return the current timestamp",function(done){
      server
      .get('/api/')
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
          done();
      });
    });

  });
  
  describe("POST /login",function(){
  
    it("login the test username and password",function(done){
      server
      .post('/api/user/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userCredentials)
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.body.result.should.equal(true)
        res.status.should.equal(200);
          done();
      });
    });
  });


  describe("GET /time",function(){

  
    it("Get time with basic auth",function(done){
      server
      .get('/api/time')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userCredentials)
      .auth('testuser@gmail.com', 'test')
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.body.current_time.should.not.equal(null)
        res.status.should.equal(200);
          done();
      });
    });
  });
  after(function(done){

    server
    .post('/api/user/delete')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(userCredentials)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      console.log(res.body)
      res.status.should.equal(200);
        done();
    });
  });

 
});

	
	
	
