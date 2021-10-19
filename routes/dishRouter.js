const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../models/authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
//------------------part 1
dishRouter.route('/')
/* .all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}) */
.get((req,res,next) => {
   // res.end('Will send all the dishes to you!');
    Dishes.find({})
    //popurate
    .populate('comments.author')
   .then((dishes)=>{
       res.status = 200;
       res.setHeader('Connect-Type','application/json');
       res.json(dishes);
   },(err)=>next(err))
   .catch((err)=>next(err));
})
//.post((req, res, next) => {
 //add authen
 .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {  
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
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   // res.end('Deleting all dishes');
   Dishes.remove({})
   .then((resp)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/json');
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
    .populate('comments.author')
    .then((dish)=>{
       res.status = 200;
       res.setHeader('Connect-Type','application/json');
       res.json(dish);
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  /* res.write('Updating the dish: ' + req.params.dishId + '\n');
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description); */
   Dishes.findByIdAndUpdate(req.params.dishId,{
       $set:req.body
   },{new:true})  
   .then((dish)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/json');
    res.json(dish);
},(err)=>next(err))
.catch((err)=>next(err));   
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   // res.end('Deleting dish: ' + req.params.dishId);
   Dishes.findByIdAndRemove(req.params.dishId)
   .then((resp)=>{
    res.status = 200;
    res.setHeader('Connect-Type','application/json');
    res.json(resp);
   },(err)=>next(err))
   .catch((err)=>next(err));
});  
 
//---------- Part II----------
 dishRouter.route('/:dishId/comments')
/* .all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}) */
.get((req,res,next) => {
   // res.end('Will send all the dishes to you!');
   console.log('****************');
   Dishes.findById(req.params.dishId)
   .populate('comments.author')
   .then((dish)=>{
       if(dish !=null){
        res.status = 200;
        res.setHeader('Connect-Type','application/json');
        res.json(dish.comments);
       }
     else{
         err = new Error('Dish ' + req.params.dishId + ' not found');
         err.status = 404 ;
         return next(err);
     }
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
   // res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
   //console.log('Post....');
     //Dishes.create(req.body)
      Dishes.findById(req.params.dishId)
     .then((dish) => {
        if(dish !=null){
            //populate
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                //poperate
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.status = 200;
                        res.setHeader('Connect-Type','application/json');
                        res.json(dish);
                    })
               
            },(err) => next(err));
           
           }
         else{
             err = new Error('Dish ' + req.params.dishId + ' not found');
             err.status = 404 ;
             return next(err);
         }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' 
    + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   // res.end('Deleting all dishes');
   console.log('Delete  comment...')
   Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish !=null){
           for(var i = (dish.comments.length -1);i>= 0 ;i --)
                dish.comments.id(dish.comments[i]._id).remove();
             dish.save()
            .then((dish)=>{
                res.status = 200;
                res.setHeader('Connect-Type','application/json');
                res.json(dish);
            },(err) => next(err));
           }
           
         else{
             err = new Error('Dish ' + req.params.dishId + ' not found');
             err.status = 404 ;
             return next(err);
         };
   },(err)=>next(err))
   .catch((err)=>next(err));
});
// Add parameter 
dishRouter.route('/:dishId/comments/:commentId')
/* .all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}) */
.get((req,res,next) => {
    //res.end('Will send the dishe ' + req.params.dishId + ' to you!');
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish !=null && dish.comments.id(req.params.commentId) != null){
            res.status = 200;
            res.setHeader('Connect-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
           }
         else if(dish == null){
             err = new Error('Dish ' + req.params.dishId + ' not found');
             err.status = 404 ;
             return next(err);
         }
         else {
            err = new Error('comment ' + req.params.commentId + ' not found');
            err.status = 404 ;
            return next(err);
         }
   },(err)=>next(err))
   .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId
  + '/comment/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish !=null && dish.comments.id(req.params.commentId )!= null){
            if(req.body.rating){
                dish.comments.id(req.params.commentId ).rating = req.body.rating;  
            }   
            if(req.body.comment){
                dish.comments.id(req.params.commentId ).commentId = req.body.comment;  
            }       
            dish.save()
            .then((dish)=>{
                //poperate
                 Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.status = 200;
                    res.setHeader('Connect-Type','application/json');
                    res.json(dish);
                })
               
            },(err) => next(err));
           
           }
         else if(dish == null){
             err = new Error('Dish ' + req.params.dishId + ' not found');
             err.status = 404 ;
             return next(err);
         }
         else {
            err = new Error('comment ' + req.params.commentId + ' not found');
            err.status = 404 ;
            return next(err);
         }
    },(err)=>next(err))
.catch((err)=>next(err));   
})
.delete(authenticate.verifyUser,(req, res, next) => {
    console.log('Delete all comment...')
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log('Check OK have Dish..');
        if(dish !=null  && dish.comments.id(req.params.commentId )!= null){
             dish.comments.id(req.params.commentId).remove();
             dish.save()
            .then((dish)=>{
                //poperate
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.status = 200;
                    res.setHeader('Connect-Type','application/json');
                    res.json(dish);
                })
            },(err) => next(err));
           }
            else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404 ;
            return next(err);
        }
        else {
           err = new Error('comment ' + req.params.commentId + ' not found');
           err.status = 404 ;
           return next(err);
        }
   },(err)=>next(err))
   .catch((err)=>next(err));
});  

module.exports = dishRouter;