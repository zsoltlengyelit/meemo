
var sio = require('socket.io'),
      mongoStore = require('connect-mongodb'),
      mongoose = require('mongoose');
  
  var models = require('./models')
    , Post = models.Post
    , Tag  = models.Tag
    , User = models.User;

// CRUD




exports.start = function(app){
  
  mongoose.connect(app.set('db-uri'));
  
  var io = sio.listen(app);
  io.set('log level', 2);
  
  io.sockets.on('connection', function (socket) {
    
    function init(){
        
        var posts = Post.find({}).execFind(function(err, posts){
           socket.emit('init', posts);
        });
    
    }
    
    init();
    
    socket.on('save', function (data) {
      console.log(data);
    });
    
    function newPost(data){
        console.log('va');
        var tags = data.tags;
        dtags = [];
        
        for(i=0; i<tags.length; i++){
          dtags.push( new Tag({tag : tags[""+i]}) );
        }
        console.log(dtags);
        dd = data;
        dd.tags = dtags;
        
        var post =  new Post(dd);
        
        post.save(function(err){
           
           if(!err) init();
           else{console.log(err); socket.emit('error', err);}
        });    
    }
    
    function deletePost(data){
        
        Post.findById(data.id, function(err, post){
            post.remove();
            init();
        });       
        
    }
    
    
    socket.on('new', newPost);
    socket.on('delete', deletePost);
    
    
    
  });

};
