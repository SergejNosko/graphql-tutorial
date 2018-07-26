import React from 'react'

import styles from './styles.scss'

import BookList from '../BookList'

class App extends React.Component {
  render () {
    return (
      <div>
        Hello
        <BookList />
      </div>
    )
  }
}

export default App
