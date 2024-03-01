const jwt = require('jsonwebtoken');
const util = require('util');


exports.sign = util.promisify(jwt.sign); //sign from callback to promise
exports.verify = util.promisify(jwt.verify);//verify from callback to promise