const graphql = require('graphql')
const ObjectId = require('mongodb').ObjectID
const _ = require('lodash')

module.exports = (app) => {
  const { Joi, BookSchema, AuthorSchema } = app
  const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
  } = graphql

  const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      genre: { type: GraphQLString },
      author: {
        type: AuthorType,
        async resolve (parent, args) {
        // the parent argument has the found book with the appropriate data
          const { authorId } = parent
          const author = await app.db.collection('authors').findOne({ _id: ObjectId(authorId) })
          return author
        }
      }
    })
  })

  const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      age: { type: GraphQLInt },
      books: {
        type: GraphQLList(BookType),
        async resolve (parent, args) {
          const { id } = parent
          const book = await app.db.collection('books').findOne({ _id: ObjectId(id) })
          return book
        }
      }
    })
  })

  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      book: {
        type: BookType,
        args: {
          id: { type: GraphQLID }
        },
        async resolve (parent, args) {
        // code to get data from db / other source
          const { id } = args
          const book = await app.db.collection('books').findOne({ _id: ObjectId(id) })
          return book
        }
      },
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLID }
        },
        async resolve (parent, args) {
          const { id } = args
          const author = await app.db.collection('authors').findOne({ _id: ObjectId(id) })
          return author
        }
      },
      books: {
        type: new GraphQLList(BookType),
        async resolve (parent, args) {
          const books = await app.db.collection('books').find().toArray()
          return books
        }
      },
      authors: {
        type: new GraphQLList(AuthorType),
        async resolve (parent, args) {
          const authors = await app.db.collection('authors').find().toArray()
          return authors
        }
      }
    }
  })

  const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      addAuthor: {
        type: AuthorType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          age: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve (parent, args) {
          const { name, age } = args
          const newAuthor = {
            name,
            age
          }

          const validatedAuthor = Joi.validate(newAuthor, AuthorSchema)

          if (!validatedAuthor.error) {
            app.db.collection('authors').save(newAuthor)
            return newAuthor
          } else {
            throw new Error('Unable to create a new author ', validatedAuthor.error)
          }
        }
      },
      addBook: {
        type: BookType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          genre: { type: new GraphQLNonNull(GraphQLString) },
          authorId: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve (parent, args) {
          const { name, genre, authorId } = args
          const newBook = {
            name,
            genre,
            authorId
          }

          const validatedAuthor = Joi.validate(newBook, BookSchema)

          if (!validatedAuthor.error) {
            app.db.collection('books').save(newBook)
            return newBook
          } else {
            throw new Error('Unable to create a new author ', validatedAuthor.error)
          }
        }
      }
    }
  })

  return new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
  })
}
