var pathUtil = require('path');

var v1=pathUtil.resolve(__dirname);

try {
console.log(`V1=${v1}`);
}catch(err){
console.error(err);
}
