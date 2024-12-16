require('dotenv').config()

module.exports = {
  AWS : {
    accessKeyId : process.env.accessKeyId,
    secretAccessKey : process.env.secretAccessKey,
    region : process.env.region
  }
}