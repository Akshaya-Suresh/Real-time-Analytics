var planCostShares = {
    "id" : "/planCostShares",
    "type": "object",
    "properties": {
    "deductible": {
        "type": "integer",
        "default":"5000"
      },
      "_org": {
        "type": "string"
      },
      "copay": {
        "type": "integer",
        "default":"10"
      },
      "objectId": {
        "type": "string"
      },
      "objectType": {
        "type": "string"
      }
    },
    "required": [
      "_org",
      "objectId",
      "objectType"
    ]

}
var linkedService = {
    "id" : "/linkedService",
    "type": "object",
    "properties": {
      "_org": {
        "type": "string"
      },
      "objectId": {
        "type": "string"   
      },
      "objectType": {
        "type": "string",
      },
      "name": {
        "type": "string",
        "default": "Yearly"
      }
    },
    "required": [
      "_org",
      "objectId",
      "objectType"
    ]
}

var planserviceCostShares = {
    "id" : "/planserviceCostShares",
    "type": "object",
    "properties": {
      "deductible": {
        "type": "integer",
        "default": "5000"
      },
      "_org": {
        "type": "string"
      },
      "copay": {
        "type": "integer",
        "default": "10"
      },
      "objectId": {
        "type": "string"
      },
      "objectType": {
        "type": "string"
      }
    },
    "required": [
      "_org",
      "objectId",
      "objectType"
    ]
}
var linkedPlanServices = {
    "id" : "/linkedPlanServices",
    "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "linkedService": {
                "$ref" : "/linkedService"
              },
              "planserviceCostShares": {
                "$ref" : "/planserviceCostShares"
              },
              "_org": {
                "type": "string"
              },
              "objectId": {
                "type": "string"
              },
              "objectType": {
                "type": "string"
              }
            },
            "required": [
              "_org",
              "objectId",
              "objectType"
            ]
        }, {
            "type": "object",
            "properties": {
              "linkedService": {
                "$ref" : "/linkedService"
              },
              "planserviceCostShares": {
                "$ref" : "/planserviceCostShares"
              },
              "_org": {
                "type": "string"
              },
              "objectId": {
                "type": "string"
              },
              "objectType": {
                "type": "string"
              }
            },
            "required": [
              "_org",
              "objectId",
              "objectType"
            ]
        }
     ]
}

var planSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id" : "/planSchema",
    "type": "object",
    "properties": {
      "planCostShares": {
        "$ref" : "/planCostShares"
      },
      "linkedPlanServices": {
        "$ref" : "/linkedPlanServices"
      },
      "_org": {
        "type": "string"
      },
      "objectId": {
        "type": "string"
      },
      "objectType": {
        "type": "string"
      },
      "planType": {
        "type": "string",
        "default": "name"
      },
      "creationDate": {
        "type": "string",
        "default": "10-10-2010"
      }
    },
    "required": [
      "_org",
      "objectId",
      "objectType"
    ]
  }
/* Not working properly
  var schema ={
      "$id" : "generalSchema",
      "type" : "object",
      "properties" : {
          "validateAnyOf" :{
              "anyOf" : [
                  {"$ref" : "/planCostShares"},
                  {"$ref" : "/linkedService" },
                  {"$ref" : "/planserviceCostShares" },
                  {"$ref" : "/linkedPlanServices"},
                  {"$ref" : "/planSchema"}
              ]
          }

      }
  } */


module.exports={planSchema:planSchema,
planCostShares:planCostShares,
linkedService:linkedService,
planserviceCostShares:planserviceCostShares,
linkedPlanServices:linkedPlanServices,

};