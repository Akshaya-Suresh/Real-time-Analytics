var express=require('express');
var router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()) 
router.use(bodyParser.urlencoded({ extended: true })) 
var db = require('../server/redisDB');


// router.post('/plan',db.createPlan)

router.post('/plan',db.createPlan)

router.get('/plan/:id',db.getPlan)

router.delete('/plan/:id', db.deletePlan)

router.delete('/plan', db.deleteFullPlan)

router.put('/plan/:id', db.updatePlan)

module.exports=router;