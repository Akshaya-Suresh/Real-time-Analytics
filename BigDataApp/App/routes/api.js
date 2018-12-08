var express=require('express');
var router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()) 
router.use(bodyParser.urlencoded({ extended: true })) 
var db = require('../server/redisDB');
require('dotenv').config();

const fs = require('fs')
const jwt = require('jsonwebtoken')
var publicKey = fs.readFileSync('./Keys/public.pem','utf8')

const passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy;

    passport.use(new GitHubStrategy({
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret ,
      callbackURL: "http://127.0.0.1:4501/api/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
     //  console.log(accessToken)
     //  console.log(refreshToken)
       
      return cb({username:profile.id})
     /* User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return cb(err, user);
      }); */
     
      }
      
  ));
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/plan');
    }

  var auth = function (req,res,next){
    var token = req.headers.authorization.substring(7,req.headers.authorization.length)
   // console.log(token);
        var verifyOptions ={
          issuer: 'Github',
          audience: 'https://127.0.0.1:4501/api/' ,
          expiresIn: '1h',
          algorithm: 'RS256'
      };
  try{
   if(jwt.verify(token,publicKey,verifyOptions)){
    next();
   }
   
  }catch(err){
    res.send({status:401,message: "Unauthorized use correct bearer token"});
  }
}
router.post('/oauth-api/oauth/token',db.getToken)

router.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.json({
    status: 'success',
    message: 'Received Activation code',

 });
});


router.post('/plan',auth, db.createPlan)

router.get('/plan/:id',auth,db.getPlanFull)

// router.get('/object/:objId',auth,db.getObject)

router.delete('/plan/:id', auth,db.deletePlan)

router.delete('/plan',auth, db.deleteFullPlan)

router.put('/plan/:id',auth, db.updatePlan)

module.exports=router;

/*
var mysql = require('mysql')
var connection = mysql.createConnection({
    host : 'localhost',
    port: 3306,
    user : 'root',
    password: 'Sas091929!!!',
    database: 'data'
   
});
var User;
connection.connect(function(err,client,done){

    if(err){
        console.log("not able to get connection "+ err);
    }
    const query1={
        text: 'SELECT password FROM "User" WHERE user="Akshaya-Suresh"'
    }
    client.query(query1,function(err,result){
        done();
        if(err){
            console.log(err);
        }
        else{
      User=result
    }
}) 
}); */