var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()) 
router.use(bodyParser.urlencoded({ extended: true })) 
var redis = require('redis');
var client = redis.createClient({port:6379,host:"localhost"});
//var plan = {};


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
   // console.log(data)
    for(var x in data){
    //  console.log(x);
       var temp = data[x]
    //  console.log(temp)
      if(temp instanceof Array){
        for(var z in temp){
         //    console.log(z);
        //   console.log(temp[z])
          var temp1 = temp[z];
                client.sadd("plan",temp1.objectType+'____'+temp1.objectId)
          for(var i in temp1){
       
            if(temp1[i] instanceof Object){
              var temp2 = temp1[i]
            // console.log(temp2.objectType+'____'+temp2.objectId)
              client.sadd("plan",temp2.objectType+'____'+temp2.objectId)
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
          client.sadd("plan",temp.objectType+'____'+temp.objectId)
        for(var y in temp){
        //   console.log(y)
        //    console.log(temp[y])
          client.HMSET(temp.objectType+'____'+temp.objectId,y,temp[y])
        }
      } 
      else{
          client.sadd("plan",data.objectType+'____'+data.objectId)
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

 
function getPlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
  }
   });
 
    
    client.HGETALL(req.params.id, function(err,result){
      if(err){
        res.status(400).json({
        status: 'error',
        message: 'Not able to fetch plan'
           });
       }
       if(result==null){
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
        else{
          client.SREM("plan",req.params.id,function(err,result){
            if(err){
              res.status(400).json({
                status: 'error',
                message: 'Cant remove from set'
                   });
                   i++
               }  
           });
        }

    });

   
    if(i==0){
      res.status(200).json({
        status: 'delete',
        message: 'Deleted from Redis',
      })
    }
     


   }
   

function deleteFullPlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
    }
  });
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

function updatePlan(req,res,next){
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
    }
  });
  var plan_id = req.params.id
  var  data= req.body   
        var flag1 = validate(data)
        if(flag1){
          client.HGETALL(plan_id,function(err,result){
            if(result==null){
              res.status(400).json({
                status: 'error',
                message: 'Object doesnt exist',
             });
            }
            else{
              for(var x in data){
                   var temp = data[x]
                  if(temp instanceof Array){
                    for(var z in temp){
                      var temp1 = temp[z];
                      for(var i in temp1){
 
                        if(temp1[i] instanceof Object){
                          var temp2 = temp1[i]
        
                          for(var j in temp2){
                       
                              client.HMSET(temp2.objectType+'____'+temp2.objectId,j,temp2[j])
                          }
                        }
                        else{
                     
                            client.HMSET(temp1.objectType+'____'+temp1.objectId,i,temp1[i])
                        }
                     
                      }
                    }
                  
                  
              
                  }
                 else if(temp instanceof Object){
           
                    for(var y in temp){
                      client.HMSET(temp.objectType+'____'+temp.objectId,y,temp[y])
                    }
                  } 
                  else{
                      client.HMSET(data.objectType+'____'+data.objectId,x,data[x])
                  } 
                }
              
              res.json({
                status: 'success',
                message: 'Plan Updated successfully',
                data : data
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
  getPlan: getPlan,
  deletePlan: deletePlan,
  updatePlan: updatePlan,
  deleteFullPlan: deleteFullPlan
}; 