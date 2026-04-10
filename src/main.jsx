import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { 
  Home, 
  ListingDetails, 
  ListingsPage, 
  AllCategory
} from './pages'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} /> 
      <Route path='listing/:listingId' element={<ListingDetails />} />
      <Route path="/listings/:type" element={<ListingsPage />} />
      <Route path="/all_category" element={<AllCategory />} />
    </Route>
  )

)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <RouterProvider router={router}/>
  </>
  // </StrictMode>,
)
