import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
export const Route = createRootRoute({
  component: Root,
})

function Root() {

  return (
    <React.Fragment>
      <div className="header">
        <SearchBar />
      </div>
      <Outlet />
      <Footer />
    </React.Fragment>
  )
}
