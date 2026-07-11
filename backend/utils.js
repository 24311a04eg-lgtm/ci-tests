/**
 * Returns true when the given message is a non-empty string
 * containing at least one non-whitespace character.
 */
function isValidMessage(message) {
  return typeof message === 'string' && message.trim().length > 0;
}

module.exports = { isValidMessage };
