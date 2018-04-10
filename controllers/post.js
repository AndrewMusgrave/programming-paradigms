const Post = require('../models/post');

module.exports = {
  getComments(req, res, next) {
    const {_id} = req.params;
    Post.findById(_id)
      .populate(['comments'])
      .then(response => {
        response
          ? res.send(response)
          : res.send([])
      })
      .catch(error => {
        console.log(
          `Error grabbing comments: ${error}`
        )
        res.status(500).send({error})
      })
  },

  createPost(req, res, next) {
    const {title, identifier} = req.body;
    Post.findOne({identifier})
      .then(post => {
        if (!post) {
          const post = new Post({
            title,
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