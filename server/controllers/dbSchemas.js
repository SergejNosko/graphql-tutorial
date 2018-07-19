module.exports = (app) => {
  const { Joi } = app

  app.AuthorSchema = Joi.object().keys({
    name: Joi.string(),
    age: Joi.number()
  })

  app.BookSchema = Joi.object().keys({
    name: Joi.string(),
    genre: Joi.string(),
    authorId: Joi.string()
  })
}
