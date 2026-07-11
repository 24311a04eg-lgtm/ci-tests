const { isValidMessage } = require('../utils');

describe('isValidMessage', () => {
  test('returns true for a valid message', () => {
    expect(isValidMessage('Hello world')).toBe(true);
  });

  test('returns false for an empty string', () => {
    expect(isValidMessage('')).toBe(false);
  });

  test('returns false for a whitespace-only string', () => {
    expect(isValidMessage('   ')).toBe(false);
  });
});
