const MongoClient = require('mongodb').MongoClient

module.exports = (app) => {
  return MongoClient.connect('mongodb://sergejnosko:24s04n@ds231941.mlab.com:31941/graphql')
    .then(connection => {
      app.db = connection.db('graphql')
      console.log('Connected to DB')
    })
    .catch(err => {
      console.log(err)
    })
}
