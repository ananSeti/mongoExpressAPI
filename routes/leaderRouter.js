const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');
const { LengthRequired } = require('http-errors');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get((req,res,next) => {
Leaders.find({})
.then((leaders)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/json');
    res.json(leaders);
},(err)=>next(err))    
 .catch((err)=>next(err));
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then((leader)=>{
        console.log('Leader Create ',leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err)); 
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on / leader');
})
.delete((req, res, next) => {
    Leaders.remove({})
    .then((resp)=>{
        res.status = 200;
        res.setHeader('Connect-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// Add parameter 
leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
       res.status = 200;
       res.setHeader('Connect-Type','application/json');
       res.json(leader);
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leader /'+ req.params.leaderId);
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})  
    .then((leader)=>{
     res.status = 200;
     res.setHeader('Connect-Type','application/json');
     res.json(leader);
 },(err)=>next(err))
 .catch((err)=>next(err)); 
})
.delete((req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
   .then((resp)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/json');
    res.json(resp);
   },(err)=>next(err))
   .catch((err)=>next(err)); 
});  
 
/* .get('/dishes/:dishId', (req,res,next) => {
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})

.post('/dishes/:dishId', (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put('/dishes/:dishId', (req, res, next) => {
  res.write('Updating the dish: ' + req.params.dishId + '\n');
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete('/dishes/:dishId', (req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});   */
module.exports = leaderRouter;