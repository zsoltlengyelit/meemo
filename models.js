
var mongoose = require('mongoose')
   , Schema = mongoose.Schema;

function md5(str){
   var crypto = require('crypto');
   return crypto.createHash('md5').update(str).digest("hex");
}

var UserSchema = new Schema({
   _id : Schema.ObjectId,
   name : { type: String, unique: true, validate: /[a-zA-Z]/ },
   password_hash : String
});

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.password_hash = md5(password);
  })
  .get(function() { return this._password; });

  UserSchema.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.password_hash;
  });  

  UserSchema.method('encryptPassword', function(password) {
    return md5(password);
  });
  
var TagSchema =  new Schema({
   tag: String
});
  
var PostSchema = new Schema({
   author:  Schema.ObjectId ,
   title :  { type: String, default: 'Title', unique: true } ,
   content  :  { type: String, default: 'text' } ,
   date  :  { type: Date, default: Date.now } ,
   tags : [ TagSchema ]
});

exports.User = mongoose.model('User',UserSchema);
exports.Post = mongoose.model('Post',PostSchema);
exports.Tag = mongoose.model('Tag',TagSchema);


