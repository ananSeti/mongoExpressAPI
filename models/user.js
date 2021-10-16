const { Schema } = require('mongoose');
var mongoose = require('mongoose');
var Schemar = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  // ใช้ passport แทน
    /*   username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }, */

    admin:{
        type:Boolean,
        default:false
    }
});
User.plugin(passportLocalMongoose);
module.exports= mongoose.model('User',User);
