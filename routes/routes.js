const PostController = require('../controllers/post')
const CommentController = require('../controllers/comment')
const PhoneNumberController = require('../controllers/phone_number');

module.exports = (app) => {
  /** Blog comments */
  app.post('/api/post', PostController.createPost)
  app.post('/api/comment', CommentController.createComment)
  app.get('/api/comments/:identifier', PostController.getComments)

  /** SMS notification */
  app.post('/api/send-message', PhoneNumberController.sendMessage);
  app.post('/api/phone-number', PhoneNumberController.addPhoneNumber);
  app.delete('/api/phone-number', PhoneNumberController.deletePhoneNumber);
  app.post('/api/phone-number-hook', PhoneNumberController.deletePhoneNumber);
}