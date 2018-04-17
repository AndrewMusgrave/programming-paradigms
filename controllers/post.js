const Post = require('../models/post');

module.exports = {
  getComments(req, res, next) {
    const {identifier} = req.params;
    Post.findOne({identifier})
      .populate(['comments'])
      .then((response) => {
        if (response) {
          response && response.comments.reverse();
          res.send(response);
        } else {
          res.send({comments: []});
        }
      })
      .catch(error => {
        console.log(
          `Error grabbing comments: ${error}`
        )
        res.status(500).send({error})
      })
  },

  createPost(req, res, next) {
    const {identifier} = req.body;
    Post.findOne({identifier})
      .then(post => {
        if (!post) {
          const post = new Post({
            identifier
          })
          post.save();
          res.send(post)
        } else {
          res.send({error: 'Post does not exist or has already been created'})
        }
      })
  }
}