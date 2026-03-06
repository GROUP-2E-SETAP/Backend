const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

/**
 * Encrypt text
 * @param {string} text
 * @returns {string}
 */
exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypt text
 * @param {string} text
 * @returns {string}
 */
exports.decrypt = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

/**
 * Hash data
 * @param {string} data
 * @returns {string}
 */
exports.hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate random token
 * @param {number} length
 * @returns {string}
 */
exports.generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
