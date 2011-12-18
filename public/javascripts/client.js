var socket = io.connect('http://localhost:3000');

socket.on('init', function (data) {
console.log(data);
  $('#newPostContent').hide();
  $('#keys').html('');  
  $('#content').hide();
  
  $(data).each(function(key, post){
    var tr = '<tr postid="'+ post._id +'"><td>' + post.title + '</td></tr>  <span class="deletePost">--</span>';    
    $('#keys').append(tr);
    
    var tagNames = [];
    for(k in post.tags){
      tagNames.push( post.tags[k].tag);
    }
    
    var div = '<div id="content-'+ post._id +'" class="cnt"> ' + post.content +
    '<p>' + tagNames.join(', ') + '</p>'+
    ' </div>';
    
    
    $('#content').append(div);
    
  });
  
  $('.cnt').hide();
  $('.cnt:not(#newPostContent):first').show();
  $('#content').show();
    
});

socket.on('error', function(err){
  alert(err.message);
});



//socket.emit('my other event', { my: 'data' });

// Simple CRUD functions

function newPost(data, cb){
  socket.emit('new', data);
  if(cb)cb();
  
}

function deletePost(postid){
  socket.emit('delete', {id : postid});
}


$(function(){  
  
  var initPost = function(){
 
    var title = $('#newPostTitle').val(),
        tagsA = $('#newTags').val().split(','),
        tags = $(tagsA).map(function(){ return $.trim(this);}),
        content = $('#newContent').val();
    
    var data = {
      'title'  : title,
      'tags'   : tags,
      'content':content
    };

    if(data.title.length > 3){
      newPost( data, function(){
        $('#newPostTitle').val('');
        $('#newTags').val('');
        $('#newContent').val('');
      });
     
    }
  };
  
  $('#newPost').click(initPost);
  
  $('#newPostTitle')
    .keypress(function(event){
      if(event.which == 13) initPost();
    })
    .typing({
      start : function(event, e){
        
        $('.cnt').hide();
        $('#newPostContent').show();
      }
    });
  
  $('#keys tr').live('click',function(){
    var id = $(this).attr('postid');
    $('.cnt').hide();
    $('#content-'+id).show();
  });
  
  $('.deletePost').live('click', function(){
    deletePost( $(this).parents('tr').attr('postid') );
  });
  
});
