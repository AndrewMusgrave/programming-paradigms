const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = {
  createComment(req, res, next) {
    const {comment, name, _id} = req.body;
    const finalName = name || 'Anonymous';
    const blogComment = new Comment({
      comment,
      name: finalName,
    })
    Promise.all([
      blogComment.save(),
      Post.findByIdAndUpdate(_id, {$push: {comments: blogComment._id}})
    ])
    .then((response) => res.send(response[0]))
    .catch((err) => res.status(500).send({error: "Unable to add new comment"}))
  }
}
