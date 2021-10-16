var express = require('express');
const bodyParser = require('body-parser');
var User =require('../models/user');
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{
  //User.findOne({username:req.body.username})
  //Use Passport ..
  User.register(new User({username:req.body.username}),
        req.body.password,(err,user)=>{
  //.then((user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      //return User.create({
      //username:req.body.username,
      //password:req.body.password});
      passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true, status:'Registration Successful!'});
      });
    }
  });

});
router.post('/login', passport.authenticate('local'),(req,res,next)=>{
//use passport
  
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true, status:'You are  Successful login '});
});

  /* if(!req.session.user){
   //if(!req.signedCookies.user){
    console.log('.user..OK...');
    var authHeader = req.headers.authorization;
    if(!authHeader){
      console.log('!authHeader');
      var err = new Error('You are not authorizationed!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
     console.log('.user..OK.2..');
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    console.log(username);
    User.findOne({username: username})
    .then((user)=>{
      console.log('findOne');  
      if(user=== null){
          var err = new Error(' user '+ username + ' does not exist');
            res.setHeader('WWW-Authenticate','Basic');
            err.status = 403;
            return next(err);
        }
        else if (user.password!==password){
          var err = new Error(' You password  is incorrect!');
          err.status = 403;
            return next(err);
        }
       else if(user.username ===username && user.password ===password){
        //aad cookie
        //res.cookie('user','admin',{signed:true})
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You are authenticated');
      }
     
    })
   .catch((err)=>next(err));
  }
  else{
    console.log('Found...')
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated');
  }
});
*/
router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error(' You are not logged in');
    err.status = 403;
    next(err);
   } 
} );

module.exports = router;
