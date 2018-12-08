var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch')

router.use(bodyParser.json()) 
router.use(bodyParser.urlencoded({ extended: true })) 
var redis = require('redis');
var client = redis.createClient({port:6379,host:"localhost"});

var plan={};

var eclient = new elasticsearch.Client({
  host : 'localhost:9200',
//  log: 'trace'
});

// Create Index
eclient.indices.create({
  index: 'plan'
}, function(err, resp, status) {
  if (err) {
      console.log(err);
  } else {
      console.log("create", resp);
  }
})
/* eclient.indices.putMapping({
  index: 'plan',
  type : '_doc',
  body:{
    properties:{
      "my_join_field": { 
        "type": "join",
        "relations": {
          "plan" :["planCostShares","linkedPlanServices"],
          "linkedPlanServices": ["linkedService","planserviceCostShares"]
        }
    }
  }

}},function(err,resp){
  if(err)
    console.log(err)
  else
    console.log(resp)
  
}); */
/* eclient.ping({
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
}); */

// OAuth2 JWT 
const fs = require('fs')
const jwt = require('jsonwebtoken')

function getToken(req,res,next){
      var payload = req.body;
   //    console.log(payload)
  //    var clientId = payload.client_id
  //     console.log(clientId)
      var privateKey = fs.readFileSync('./Keys/private.pem','utf8')
   //   console.log(privateKey)

      var signOptions ={
          issuer: 'Github',
          audience: 'https://127.0.0.1:4501/api/' ,
          expiresIn: '1h',
          algorithm: 'RS256'
      };
 var token = jwt.sign(payload,privateKey,signOptions)
   res.json({
      "access_token" : token,
      "token_type" : "Bearer"
  });
}

// Validate the JSON schema 
function validate(data){
  var Validator = require('jsonschema').Validator;
  var v = new Validator();

  v.addSchema(require('../JSON Schema/jsonSCHM').planCostShares,'/planCostShares')
  v.addSchema(require('../JSON Schema/jsonSCHM').linkedService,'/linkedService')
  v.addSchema(require('../JSON Schema/jsonSCHM').planserviceCostShares,'/planserviceCostShares')
  v.addSchema(require('../JSON Schema/jsonSCHM').linkedPlanServices,'/linkedPlanServices')

  var schema = require('../JSON Schema/jsonSCHM').planSchema;
  var results = v.validate(data,schema).valid
  console.log(results)
  if (results){
    return true;
  }
  else{
    return false;
  }

}

// Create API - Store each JSON object separately , Elastic search document
function createPlan(req,res,next){

  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
    }
   });
  
  var data = req.body
  
  var flag = validate(data)
  if(flag){
    // Inserting the document on the index
    eclient.index({
      index:'plan',
      id : data.objectId,
      type : '_doc',
      refresh : true,
      body : {
          data
      }
      
    },function(err,resp){
      if(err)
       console.log(err)
      else
       console.log(resp)
    })
   // console.log(data)
    for(var x in data){

    //  console.log(x);
       var temp = data[x]
   
      // client.sadd("plan",data.objectType+'____'+data.objectId)
    //  console.log(temp)
      if(temp instanceof Array){
        for(var z in temp){
         //    console.log(z);
        //   console.log(temp[z])
       // console.log(x)
          var temp1 = temp[z];
        //  console.log(data.objectType+'____'+data.objectId+'____'+x,temp1.objectType+'____'+temp1.objectId)
         client.sadd(data.objectType+'____'+data.objectId+'____'+x,temp1.objectType+'____'+temp1.objectId)
             //   client.sadd("plan",temp1.objectType+'____'+temp1.objectId)
          for(var i in temp1){
       
            if(temp1[i] instanceof Object){
              var temp2 = temp1[i]
            // console.log(temp2.objectType+'____'+temp2.objectId)
         //   console.log(temp1.objectType+'____'+temp1.objectId+'____'+i,temp2.objectType+'____'+temp2.objectId)
            client.sadd(temp1.objectType+'____'+temp1.objectId+'____'+i,temp2.objectType+'____'+temp2.objectId)
              for(var j in temp2){
            //    console.log(temp2.objectType+'____'+temp2.objectId,j,temp2[j])
                  client.HMSET(temp2.objectType+'____'+temp2.objectId,j,temp2[j])
              }
            }
            else{
              //  console.log(i,temp1[i])
                client.HMSET(temp1.objectType+'____'+temp1.objectId,i,temp1[i])
            }
         
          }
        }
      
      
  
      }
     else if(temp instanceof Object){
     // console.log(data.objectType+'____'+data.objectId+'____'+x,temp.objectType+'____'+temp.objectId)
      client.sadd(data.objectType+'____'+data.objectId+'____'+x,temp.objectType+'____'+temp.objectId)
   
        //  client.sadd("plan",temp.objectType+'____'+temp.objectId)
        for(var y in temp){
        //   console.log(y)
        //    console.log(temp[y])
          client.HMSET(temp.objectType+'____'+temp.objectId,y,temp[y])
       /*   eclient.index({
            index:'plan',
            id : temp.objectId,
            routing : data.objectId,
            type : '_doc',
            refresh : true,
            body : {
            y : temp[y]
            },
            parent: data.objectId
          },function(err,resp){
            if(err)
             console.log(err)
            else
             console.log(resp)
          })  */

        }
      } 
      else{
         // client.sadd("plan",data.objectType+'____'+data.objectId)
          client.HMSET(data.objectType+'____'+data.objectId,x,data[x])
          
    
      } 
 
      
    }
    res.json({
      status: 'success',
      message: 'Plan created successfully',
      data : data
   });
  }    else{
     res.status(400).json({
      status: 'error',
      message: 'Invalid JSON'
     });
  }
 }

// Read API - Get the JSON path (set)
function getPlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
  }
   });
    client.SMEMBERS(req.params.id, function(err,result){
      if(err){
        res.status(400).json({
        status: 'error',
        message: 'Not able to fetch plan'
           });
       }
       else if(result==null|| result==undefined){
        res.status(400).json({
          status: 'error',
          message: 'Not a valid Id',

      });
       }
       else{
          res.status(200).json({
            status: 'get',
            message: 'Values stored in Redis',
            data : result
        });
     }
      });

}

// Experiment of Read API logically
function getPlan123(req,res,next){
  var i =0;
  var plan={};
  var lps=[];
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
  }
   });

   client.scan('0',function(err,result){
    // console.log(result)
     result[1].forEach((values)=>{
        if(values.match(req.params.id)){
            client.TYPE(values,function(err2,result2){
           //  console.log(values,result2)
             if(result2=='hash'){
                 client.HGETALL(values,function(err1,result1){
                 //  plan = JSON.stringify(result1);
                 plan=result1;
                
                   })
             }
             if(result2=='set'){
               client.SSCAN(values,'0',function(err3,result3){
              //   console.log(result3)
                 result3[1].forEach((sresult)=>{
               //    console.log(sresult)
                  client.SCAN('0',function(terr,tresult){
                //     console.log(tresult[1])
                    tresult[1].forEach((tvalues)=>{
                   //   console.log(tvalues)
                      if(tvalues.match(sresult)){
                      // console.log(sresult)
                         client.TYPE(tvalues,function(terr1,tresult1){
            
                           if(tresult1 == 'set'){
                             client.SSCAN(tvalues,'0',function(terr2,tresult2){
                           //    console.log(tresult2)
                               tresult2[1].forEach((tresult2)=>{
                             //    console.log(tresult2)
                                client.HGETALL(tresult2,function(terr3,tresult3){
                             
                                 
                                  if(tresult2.match('service')){       
                                 //   lps['linkedService']=tresult3;
                                    // plan['plan']['linkedPlanServices']['linkedService']=tresult3;
                                     plan['linkedPlanServices']['linkedService']=tresult3;
                        //        console.log('linkedService',tresult3)
                                  }
                                  if(tresult2.match('membercostshare')){
                                   //    plan['plan']['linkedPlanServices']['planserviceCostShares']=tresult3;
                                    plan['linkedPlanServices']['planserviceCostShares']=tresult3
                                //    console.log(plan)
                                    res.status(200).json({
                                      data: plan
                                  
                                    });
                                       i++;
                                //  console.log('planserviceCostShares',tresult3)
                               
                              
                                  }
                                 
                               
                                   })
                                
                               })
                         

                             })
                           }
                           else{
                            client.HGETALL(sresult,function(err1,result1){
                              if(sresult.match('planservice')){
                                plan['linkedPlanServices'] = result1
                             //   console.log('linkesPlanServices',result1)
                        
                              }
                              if(sresult.match('membercostshare')){
                             //   plan['plan'+'planCostShares'] = result1
                             plan['planCostShares'] = result1
                            //    console.log('planCostShares',result1)
                                
                              }
                             
                               })
                           }
                          
                         })
                      }
                    })
                  })
           
                 })
             
               })
             }
        
            })
        }
     })
  
   })

 /*

   
    client.SMEMBERS(req.params.id, function(err,result){
      if(err){
        res.status(400).json({
        status: 'error',
        message: 'Not able to fetch plan'
           });
       }
       else if(result==null|| result==undefined){
        res.status(400).json({
          status: 'error',
          message: 'Not a valid Id',

      });
       }
       else{
          res.status(200).json({
            status: 'get',
            message: 'Values stored in Redis',
            data : result
        });
     }
      }); */

}

// Read API - Read the whole JSON payload 
async function getPlanFull(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
      }
   });
   var planId = req.params.id
   client.HGETALL(planId,function(err,result){
        plan['plan']=result
   })
   client.HGETALL('membercostshare____1234vxc2324sdf',function(err3,result3){
      plan['plan']['planCostShares']=result3;
     })    
    var tempData = [];
    var tempPlan = {};
      client.HGETALL('planservice____27283xvx9sdf',function(err3,result3){
        tempPlan = result3;
      })    
          client.HGETALL('service____1234520xvc30sfs',function(err5,result5){
            tempPlan['linkedService']=result5
          })
     
          client.HGETALL('membercostshare____1234512xvc1314sdfsd',function(err5,result5){
            tempPlan['planserviceCostShares']=result5
            tempData.push(tempPlan)
            plan['plan']['linkedPlanService']=tempData;
          })
   
          client.HGETALL('planservice____27283xvx9asdff',function(err3,result3){
              tempPlan = result3;
            })    
                client.HGETALL('service____1234520xvc30asdf',function(err5,result5){
                  tempPlan['linkedService']=result5
       
                })
              client.HGETALL('membercostshare____1234512xvc1314asdfs',function(err5,result5){
                  tempPlan['planserviceCostShares']=result5
                  tempData.push(tempPlan)
                  plan['plan']['linkedPlanService']=tempData;
                   // console.log(JSON.stringify(plan))
                   res.status(200).json({
                    status: 'get',
                    message: 'Values stored in Redis',
                    data : plan
                   });
                })
  

}

// Read API - Get the JSON object (hash)
function getObject(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
  }
   });
    client.HGETALL(req.params.objId, function(err,result){
      if(err){
        res.status(400).json({
        status: 'error',
        message: 'Not able to fetch object'
           });
       }
       else if(result==null|| result==undefined){
        res.status(400).json({
          status: 'error',
          message: 'Not a valid Id'

      });
       }
       else{
          res.status(200).json({
            status: 'get',
            message: 'Values stored in Redis',
            data : result
        });
     }
      });

}

// Delete API - To delete the JSON object 
function deletePlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
      }
   });

   
    var i=0;
    client.DEL(req.params.id,function(err,result){
        if(err){
          res.status(400).json({
            status: 'error',
            message: 'Not able to delete'
               });
               i++
        }
      });
  
          
    if(i==0){
      helpDelete(req.params.id,res,i);
      res.status(200).json({
        status: 'delete',
        message: 'Deleted from Redis',
      });
    }
    
   

  }
   
// Delete API - To delete the full JSON payload  
function deleteFullPlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
    }
  });
  eclient.indices.delete({
    index:'_all'
  },function(err, res) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Indexes have been deleted!');
    }
  })

  client.FLUSHDB(function(err,result){
    if(err){
      console.log(err);
      res.status(400).json({
        status: 'error',
        message: 'Error in deleting'
      });
    }
    else{
      res.status(200).json({
        status: 'delete',
        message: 'Deleted completely from Redis',
      });
    }
  });

}

// Update API -  To update the JSON objects
function updatePlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
    }
   });

  var flag = validate(req.body)

  if(flag){
    client.HGETALL(req.params.id, function(err,result){
      if(result==null){
        res.status(400).json({
          status: 'error',
          message: 'Object doesnt exist',
       });
    }
  });
  console.log(req.body)
    client.HMSET(req.params.id, req.body, function(err,result){
      if(err){
        console.log(err)
        res.status(400).json({
          status: 'error',
          message: 'Cant update',
       });
      }
      else{
          
        res.json({
          status: 'success',
          message: 'Plan Updated successfully',
          data : req.body
       });
      }
    })
    
  }     
     
      else{
        res.status(400).json({
          status: 'error',
          message: 'Invalid JSON'
         }); 
      } 
  

  
}

module.exports ={
  createPlan:createPlan,
 // getPlan: getPlan,
  deletePlan: deletePlan,
  updatePlan: updatePlan,
  deleteFullPlan: deleteFullPlan,
//  getObject:getObject,
  getToken: getToken,
 // getPlan123: getPlan123,
  getPlanFull : getPlanFull
}; 

function helpDelete(inp,res,i){
  if(i==0){
    client.keys('*', function (err, keys) {
      if (err) {
        res.status(400).json({
        status: 'error',
        message: 'Not able to delete'
           });
           i++
          }

 else{
   //    console.log(keys);

   keys.forEach(function(key){
     client.TYPE(key,(err,res)=>{
//     console.log(key,res)
     if(key.includes(inp)){
    //   console.log(key)
         client.SMEMBERS(key, function(err,result){
     //       console.log(result)
           keys.forEach(function(key1){
            client.TYPE(key,(err,res)=>{
              //     console.log(key,res)
              for(var temp in result){
                if(key1.includes(result[temp])){
                   helpDelete(result[temp],res,i)
                }
              }
                   
                   })
           })

          if(err){
            console.log(err)
            i++
           }
           else if(result==null|| result==undefined){
              console.log(err)
           }
           else{
             client.SREM(key,result,function(err2,result2){
              if(err2) {
                console.log(err2)
                i++
              }
                
    
             });
            client.DEL(result,function(err1,result1){
              if(err1){
                console.log(err1)
                i++
              }
          });

        }
      });
     
             
  }
    if(res=='set'){
  //    console.log(key,res)

      if(client.SISMEMBER(key,inp)){
        client.SREM(key,inp,function(err1,result){

          if(err1){
            res.status(400).json({
              status: 'error',
              message: 'Cant remove from set'
                 });
                 i++
             } 
           });
          
      }
      
     } 
     })
   })

 }

         
    });  
  }

}