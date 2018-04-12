const PostController = require('../controllers/post')
const CommentController = require('../controllers/comment')

module.exports = (app) => {
  app.post('/api/post', PostController.createPost)
  app.post('/api/comment', CommentController.createComment)
  app.get('/api/comments/:identifier', PostController.getComments)
}