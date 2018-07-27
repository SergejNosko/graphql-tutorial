import React from 'react'
import { graphql } from 'react-apollo'

import { getBookQuery } from '../../queries'

class BookDetails extends React.Component {
  displayDetails = () => {
    const { book } = this.props.data

    if (book) {
      return (
        <div>
          <h2>{book.name}</h2>
          <p>{book.genre}</p>
          <p>{book.author.name}</p>
          <ul>
            {book.author.books.map((b, i) => (
              <li key={i}>{b.name}</li>
            ))}
          </ul>
        </div>
      )
    }

    return <div>No book selected...</div>
  }

  render () {
    return (
      <div>
        <p>Output book details here: </p>
        {this.displayDetails()}
      </div>
    )
  }
}

export default graphql(getBookQuery, {
  options: (props) => ({
    variables: {
      id: props.bookId
    }
  })
})(BookDetails)
