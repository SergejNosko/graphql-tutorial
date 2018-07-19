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
    GraphQLList
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
        resolve (parent, args) {
          const { id } = parent
        // return _.filter(books, { authorId: id })
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
        resolve (parent, args) {
          const { id } = args
        // return _.find(authors, { id })
        }
      },
      books: {
        type: new GraphQLList(BookType),
        resolve (parent, args) {
        // return books
        }
      },
      authors: {
        type: new GraphQLList(AuthorType),
        resolve (parent, args) {
        // return authors
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
          name: { type: GraphQLString },
          age: { type: GraphQLInt }
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
          name: { type: GraphQLString },
          genre: { type: GraphQLString },
          authorId: { type: GraphQLID }
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
