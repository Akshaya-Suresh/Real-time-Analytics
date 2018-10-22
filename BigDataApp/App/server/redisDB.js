var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()) 
router.use(bodyParser.urlencoded({ extended: true })) 
var redis = require('redis');
var client = redis.createClient({port:6379,host:"localhost"});
var plan = {};

function createPlan(req,res,next){
  
  client.on('connect',function(err) {
    console.log("Redis client is connected");
    if(err){
      console.log("Not able to connect to Redis "+ err);
      res.status(400).send(err);
    }
   });
 
  const data = req.body;
  const Joi = require('joi');
  const schema = require('../JSON Schema/jsonSchema').Schema;
  Joi.validate(data,schema,(err,value) =>{
    if(err){
        console.log(err);
       res.status(400).json({
        status: 'error',
        message: 'Invalid JSON schema',
      });

    }
    else{

      try{
         createFullMap(data);
         for(var x in plan){
           client.sadd("plan",x)
           var temp = plan[x]
           for(var y in temp){

             client.HMSET(x,y,temp[y])
         
           }
         }
          }
          catch(error){
            console.error(error);
          }
       //   console.log(data.objectId);
            res.json({
              status: 'success',
              message: 'Plan created successfully',
              data : data
          });
      
      }
    });


 
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

    });

    if(req.params.id in plan && i==0){
       delete plan[req.params.id];
       client.SREM("plan",req.params.id,function(err,result){
        if(err){
          res.status(400).json({
            status: 'error',
            message: 'Cant remove from set'
               });
           }  
       });
    }
    
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
      plan={};
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

    client.FLUSHDB(function(err,result){
      if(err){
        console.log(err);
        res.status(400).json({
          status: 'error',
          message: 'Plan ID doesnt exist'
        });
        plan={};
      }
    });
    const data = req.body; 
        try{
           createFullMap(data);
           for(var x in plan){
             client.sadd("plan",x)
             var temp = plan[x]
             for(var y in temp){
  
               client.HMSET(x,y,temp[y])
           
             }
           }
            }
            catch(error){
              console.error(error);
            }
         //   console.log(data.objectId);
              res.json({
                status: 'success',
                message: 'Plan updated successfully',
                data : data
            });
        
        
    
  
}

  function createFullMap(data){
      plan[data.objectType+'_____'+data.objectId] = {
        _org : data._org,
        objectId : data.objectId,
        objectType : data.objectType,
        planType : data.planType,
        creationDate : data.creationDate
       };
    plan[data.planCostShares.objectType+'____'+data.planCostShares.objectId] = data.planCostShares;
    plan[data.linkedPlanServices[0].linkedService.objectType+'____'+data.linkedPlanServices[0].linkedService.objectId] = data.linkedPlanServices[0].linkedService;
    plan[data.linkedPlanServices[0].planserviceCostShares.objectType+'____'+data.linkedPlanServices[0].planserviceCostShares.objectId] = data.linkedPlanServices[0].planserviceCostShares;
    plan[data.linkedPlanServices[1].linkedService.objectType+'____'+data.linkedPlanServices[1].linkedService.objectId] = data.linkedPlanServices[1].linkedService;
    plan[data.linkedPlanServices[1].planserviceCostShares.objectType+'____'+data.linkedPlanServices[1].planserviceCostShares.objectId] = data.linkedPlanServices[1].planserviceCostShares;
    plan[data.linkedPlanServices[0].objectType+'____'+data.linkedPlanServices[0].objectId] = {
        _org : data.linkedPlanServices[0]._org,
        objectId : data.linkedPlanServices[0].objectId,
        objectType : data.linkedPlanServices[0].objectType
      };
     plan[data.linkedPlanServices[1].objectType+'____'+data.linkedPlanServices[1].objectId] = {
        _org : data.linkedPlanServices[1]._org,
        objectId : data.linkedPlanServices[1].objectId,
        objectType : data.linkedPlanServices[1].objectType
      };
     plan[data.linkedPlanServices[1].objectType+'____'+data.linkedPlanServices[1].objectId] = {
        _org : data.linkedPlanServices[1]._org,
        objectId : data.linkedPlanServices[1].objectId,
        objectType : data.linkedPlanServices[1].objectType
      };

  }

module.exports ={
  createPlan:createPlan,
  getPlan: getPlan,
  deletePlan: deletePlan,
  updatePlan: updatePlan,
  deleteFullPlan: deleteFullPlan
};