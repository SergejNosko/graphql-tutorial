import React from 'react'
import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import styles from './styles.scss'

const getBooksQuery = gql`
  {
    books {
      name
      genre
      author {
        name
        age
      } 
    }
  }
`

class BookList extends React.Component {
  render () {
    return (
      <ul>
        <li>Book</li>
      </ul>
    )
  }
}

export default graphql(getBooksQuery)(BookList)
