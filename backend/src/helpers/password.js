const { randomBytes, scrypt: derive, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(derive);
async function hash(password) {
  const salt = randomBytes(16).toString('hex');
  return salt + ':' + (await scrypt(password, salt, 64)).toString('hex');
}
async function verify(password, stored) {
  const [salt, key] = stored.split(':');
  return timingSafeEqual(Buffer.from(key, 'hex'), await scrypt(password, salt, 64));
}
module.exports = { hash, verify };
