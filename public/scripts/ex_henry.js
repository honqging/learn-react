var CommentBox = React.createClass({
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    // comment.id = Date.now();
    // var newComments = comments.concat([comment]);
    // this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return {data: [
      {author: "hong", text: "hahhahhhhhhh"},
      {author: "Jordan", text: "another comment"}
    ]};
  },
  componentDidMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },


  render: function(){
    return (
      <div className="CommentBox">
        <h1>Comment</h1>
        <CommentList data = {this.state.data} />
        <CommentForm onCommentSubmit = {this.handleCommentSubmit}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    // for(var i = 0; i<this.props.data.length; i++){
    //   commentNodes += "<h2>" + this.props.data[i].author.toString()  + "</h2>";
    // }
    return (
      <div className="commentList">
        Hello, world! I am a CommentList
        <h1></h1>
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
          :
        </h3>
        <h4 className="commentText">
          {this.props.children}
        </h4>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },
  render: function(){
    return(
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type='text' placeholder="your name" ref="author"/>
        <input type='text' placeholder="say something" ref="text"/>
        <input type='submit' value="post" />
        Hello, form
      </form>
    )
  }

})

// 更新 state

ReactDOM.render(
  <CommentBox url='/api/comments' pollInterval={3000}/>,
  document.getElementById('content')
);
