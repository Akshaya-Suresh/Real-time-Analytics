const Joi = require('joi')
const schema=
Joi.object().keys({
  
  planCostShares: Joi.object().keys({
        deductible: Joi.number().default(2000),
        _org: Joi.string().required(),
        copay: Joi.number().default(100),
        objectId: Joi.string().required(),
        objectType: Joi.string().required()
  }),
  linkedPlanServices: Joi.array().items(Joi.object().keys({
      linkedService: Joi.object().keys({
        _org: Joi.string().required(),
        objectId: Joi.string().required(),
        objectType: Joi.string().required(),
        name: Joi.string().default("Yearly")
      }),
      planserviceCostShares: Joi.object().keys({
        deductible: Joi.number().default(2000),
        _org: Joi.string().required(),
        copay: Joi.number().default(100),
        objectId: Joi.string().required(),
        objectType: Joi.string().required()
      }),
        _org: Joi.string().required(),
        objectId: Joi.string().required(),
        objectType: Joi.string().required()
  }),
  Joi.object().keys({
    linkedService: Joi.object().keys({
      _org: Joi.string().required(),
      objectId: Joi.string().required(),
      objectType: Joi.string().required(),
      name: Joi.string().default("Yearly")
    }),
    planserviceCostShares: Joi.object().keys({
      deductible: Joi.number().default(2000),
      _org: Joi.string().required(),
      copay: Joi.number().default(100),
      objectId: Joi.string().required(),
      objectType: Joi.string().required()
    }),
      _org: Joi.string().required(),
      objectId: Joi.string().required(),
      objectType: Joi.string().required()
  })),
  _org: Joi.string().required(),
  objectId: Joi.string().required(),
  objectType: Joi.string().required(),
  planType:  Joi.string().default("inNetwork"),
  creationDate: Joi.date().default("10/10/2010")

});
  module.exports={Schema:schema};