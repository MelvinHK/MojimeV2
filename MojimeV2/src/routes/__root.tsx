import { Outlet, createRootRoute } from '@tanstack/react-router'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import ModalProvider from '../components/Providers/ModalProvider'
export const Route = createRootRoute({
  component: Root,
})

function Root() {

  return (
    <ModalProvider>
      <div className="header">
        <SearchBar />
      </div>
      <Outlet />
      <Footer />
    </ModalProvider>
  )
}
