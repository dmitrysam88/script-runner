const os = require('os');

const { username, homedir } = os.userInfo();
const hostname = os.hostname();

module.exports = {
  hostname,
  username,
  homedir,
}
