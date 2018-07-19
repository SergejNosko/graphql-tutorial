const Koa = require('koa')
const Router = require('koa-joi-router')
const Joi = Router.Joi
const mount = require('koa-mount')
const graphqlHTTP = require('koa-graphql')

const app = new Koa()
app.Joi = Joi
require('./controllers/dbSchemas')(app)
const schema = require('./schema/schema')(app)

require('./lib/db')(app)

app.use(mount('/graphql', graphqlHTTP({
  schema,
  graphiql: true
})))

app.listen(3000, err => {
  console.log('Server is served at http://localhost:3000')
})
