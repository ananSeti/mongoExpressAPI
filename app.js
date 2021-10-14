var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session =require('express-session');
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose =require('mongoose');

const Dishes = require('./models/dishes');
const promotions = require('./models/promotions');
const leader = require('./models/leaders');

const url ='mongodb://localhost:27017/confusion';

const connect = mongoose.connect(url);
connect.then((db)=>{
  console.log('Connected correctly to server');
},(err)=>{console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//original
//app.use(cookieParser());
 // app.use(cookieParser('1234567890')); // No use cookie ,use session instead

 app.use(session({
   name:'session-id',
   secret:'12345-6789-09876-54321',
   saveUninitialized:false,
   resave:false,
   store:new FileStore()
 }));
 
 app.use('/', indexRouter);
 app.use('/users', usersRouter);
 
 // Authen function
 function auth(req,res,next){

  console.log(req.headers);
  //Cookie
  // console.log(req.signedCookies);
     console.log(req.session);  
  if(!req.session.user){
   //if(!req.signedCookies.user){
    console.log('...OK...app');
    var authHeader = req.headers.authorization;
    
    if(!authHeader){
      console.log('!authHeader');
      var err = new Error('You are not authorizationed!');
      err.status = 401;
      return next(err);
    }
     console.log('...OK.2..');
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    if(req.session.use ==='authenticated' ){
      //aad cookie
      //res.cookie('user','admin',{signed:true})
      //req.session.user = 'admin';
      next();
    }
    else{
      var err = new Error('You are not authorizationed!');
      //res.setHeader('WWW-Authenticate','Basic');
      err.status = 403;
      return next(err);
    }
  }
  else{
    //if(req.signedCookies.user ==='admin'){
      if(req.session.user ==='admin'){
      next();
    }
    else{
      var err = new Error('You are not authorizationed!');
      
      err.status = 401;
      return next(err);
    }
  }
}
//use authen function 
app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
