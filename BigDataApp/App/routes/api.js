var express=require('express');
var router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()) 
router.use(bodyParser.urlencoded({ extended: true })) 
var db = require('../server/redisDB');
const fs = require('fs')
const jwt = require('jsonwebtoken')

const passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy;


passport.use(new GitHubStrategy({
    clientID: "ca89389a9a6f7a3c6164",
    clientSecret:"54f19a15db4af8963268a6ae542329db64c7a2e6" ,
    callbackURL: "http://127.0.0.1:4501/api/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
     console.log(accessToken)
   //  console.log(refreshToken)
     
    return cb({username:'Akshaya-Suresh'})
   /* User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
   
    }
    
));


// router.post('/plan',db.createPlan)

router.post('/oauth-api/oauth/token', function getToken(req,res,next){
    var payload = req.body;
//    console.log(payload)
    var clientId = payload.client_id
    console.log(clientId)
    var privateKey = fs.readFileSync('./routes/private.pem','utf8')
    console.log(privateKey)
    var publicKey = fs.readFileSync('./routes/public.pem','utf8')
    console.log(publicKey)
    var signOptions ={
        issuer:'Github',
        audience: 'https://127.0.0.1:4501/api/' ,
        expiresIn: '30d',
        algorithm: 'RS256'
    };
   console.log( jwt.sign(payload,privateKey,signOptions))
});

router.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/plan');
});



router.post('/plan',db.createPlan)

router.get('/plan/:id',db.getPlan)

router.get('/object/:objId',db.getObject)

router.delete('/plan/:id', db.deletePlan)

router.delete('/plan', db.deleteFullPlan)

router.put('/plan/:id', db.updatePlan)

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