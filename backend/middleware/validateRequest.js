const MAX_SELECTED_EMAILS = 470;
const INVALID_REQUEST_MESSAGE = 'Invalid data sent. Please check your payload.';

function validateRequest(req, res, next) {
  const { selectedEmails, ACCESS_TOKEN } = req.body;
  const { action } = req.query;

  if (!selectedEmails || !ACCESS_TOKEN || !action) {
    return res.status(400).send(INVALID_REQUEST_MESSAGE);
  }

  if (selectedEmails.length > MAX_SELECTED_EMAILS) {
    return res
      .status(401)
      .json(
        `Selected emails length should be less than ${MAX_SELECTED_EMAILS}`
      );
  }

  next();
}

module.exports = {
  validateRequest,
};
