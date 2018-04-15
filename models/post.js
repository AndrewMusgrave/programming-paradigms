const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  identifier: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
}, {
  timestamps: true
});

PostSchema.virtual('postCount').get(function() {
  return this.comments.length
})

const Post = mongoose.model('post', PostSchema);

module.exports = Post;