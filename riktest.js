/**
 * simple path utility.
 */
var pathUtil = require('path');
var v1 = pathUtil.resolve(__dirname);
/**
 * path-process
 */
try {
    console.log(`V1=${v1}`);
}catch (err) {
    console.error(err);
}
