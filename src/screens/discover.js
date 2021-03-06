/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {useAsync} from 'react-async'
import * as booksClient from '../utils/books-client'
import BookRow from '../components/book-row'
import {BookListUL, Spinner} from '../components/lib'

function initialSearch() {
  return booksClient.search('')
}

function DiscoverBooksScreen() {
  const [query, setQuery] = React.useState('')
  const [hasSearched, setHasSearched] = React.useState()
  const {data, isPending, isRejected, isResolved, error, reload} = useAsync({
    promiseFn: initialSearch,
    deferFn: booksClient.search,
  })
  const {books} = data || {books: []}

  function handleInputChange(e) {
    setQuery(e.target.value)
  }

  function handleSearchClick(e) {
    e.preventDefault()
    setHasSearched(true)
    reload(query)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <input
            onChange={handleInputChange}
            placeholder="Search books..."
            id="search"
            css={{width: '100%'}}
          />
          <Tooltip label="Search Books">
            <label htmlFor="search">
              <button
                type="submit"
                css={{
                  border: '0',
                  position: 'relative',
                  marginLeft: '-35px',
                  background: 'transparent',
                }}
              >
                {isPending ? (
                  <Spinner />
                ) : isRejected ? (
                  <FaTimes aria-label="error" css={{color: 'red'}} />
                ) : (
                  <FaSearch aria-label="search" />
                )}
              </button>
            </label>
          </Tooltip>
        </form>

        {isRejected ? (
          <div css={{color: 'red'}}>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        {hasSearched ? null : (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few books for you...</p>
            {isPending ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : isResolved && books.length ? (
              <p>Here you go! Find more books with the search bar above.</p>
            ) : isResolved && !books.length ? (
              <p>
                Hmmm... I couldn't find any books to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}
        {isResolved ? (
          books.length ? (
            <BookListUL css={{marginTop: 20}}>
              {books.map(book => (
                <li key={book.id}>
                  <BookRow key={book.id} book={book} />
                </li>
              ))}
            </BookListUL>
          ) : hasSearched ? (
            <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
              <p>Hmmm... can't find any books</p>
              <p>Here, let me load a few books for you...</p>
              {isPending ? (
                <div css={{width: '100%', margin: 'auto'}}>
                  <Spinner />
                </div>
              ) : (
                <p>
                  Hmmm... I couldn't find any books with the query "{query}."
                  Please try another.
                </p>
              )}
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  )
}

export default DiscoverBooksScreen
