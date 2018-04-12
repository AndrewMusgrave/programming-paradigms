const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = {
  createComment(req, res, next) {
    const {comment, poster, _id} = req.body;
    const blogComment = new Comment({
      comment,
      poster
    })
    Promise.all([
      blogComment.save(),
      Post.findByIdAndUpdate(_id, {$push: {comments: blogComment._id}})
    ])
    .then(() => res.send({sucess: "Added successfully"}))
    .catch((err) => res.status(500).send({error: "Unable to add new comment"}))
  }
}
