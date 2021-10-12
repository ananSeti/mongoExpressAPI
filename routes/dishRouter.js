const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
/* .all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}) */
.get((req,res,next) => {
   // res.end('Will send all the dishes to you!');
   Dishes.find({})
   .then((dishes)=>{
       res.status = 200;
       res.setHeader('Connect-Type','application/josn');
       res.json(dishes);
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post((req, res, next) => {
   // res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
   //console.log('Post....');
     Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
   // res.end('Deleting all dishes');
   Dishes.remove({})
   .then((resp)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/josn');
    res.json(resp);
   },(err)=>next(err))
   .catch((err)=>next(err));
});
// Add parameter 
dishRouter.route('/:dishId')
/* .all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}) */
.get((req,res,next) => {
    //res.end('Will send the dishe ' + req.params.dishId + ' to you!');
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
       res.status = 200;
       res.setHeader('Connect-Type','application/josn');
       res.json(dish);
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
  /* res.write('Updating the dish: ' + req.params.dishId + '\n');
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description); */
   Dishes.findByIdAndUpdate(req.params.dishId,{
       $set:req.body
   },{new:true})  
   .then((dish)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/josn');
    res.json(dish);
},(err)=>next(err))
.catch((err)=>next(err));   
})
.delete((req, res, next) => {
   // res.end('Deleting dish: ' + req.params.dishId);
   Dishes.findByIdAndRemove(req.params.dishId)
   .then((resp)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/josn');
    res.json(resp);
   },(err)=>next(err))
   .catch((err)=>next(err));
});  
 

module.exports = dishRouter;