const PostController = require('../controllers/post')
const CommentController = require('../controllers/comment')
const PhoneNumberController = require('../controllers/phone_number');

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

module.exports = (app) => {
  /** Blog comments */
  app.post('/api/post', PostController.createPost)
  app.post('/api/comment', CommentController.createComment)
  app.get('/api/comments/:identifier', PostController.getComments)

  /** SMS notification */
  app.post('/api/send-message', asyncMiddleware(PhoneNumberController.sendMessage));
  app.post('/api/phone-number', asyncMiddleware(PhoneNumberController.addPhoneNumber));
  app.delete('/api/phone-number', asyncMiddleware(PhoneNumberController.deletePhoneNumber));
  app.post('/api/receive-message-hook', PhoneNumberController.receiveTextMessage);

  /** SMS errors */
  app.post('/api/receive-error-hook', PhoneNumberController.onErrorHook);
}