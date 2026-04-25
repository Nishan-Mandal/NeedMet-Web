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
  AllCategory, 
} from './pages'
import { SystemState } from './components'
import MaintenanceImg from "./assets/maintenance.jpg"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} /> 
      <Route path='listing/:listingId' element={<ListingDetails />} />
      <Route path="/listings/:type" element={<ListingsPage />} />
      <Route path="/listings/category/:category_name" element={<ListingsPage />} />
      <Route path="/all_categories" element={<AllCategory />} />
      <Route 
        path="/about_us" 
        element={
          <SystemState 
            imageSrc={MaintenanceImg} 
            title='Feature in' 
            highlight='Progress' 
            message="We're crafting something exceptional behind the scenes.This experience will be ready for you very soon." 
            actionType='navigate' 
            actionLabel='Back to Home' 
            actionTo='/' 
          />
        } 
      />
      <Route 
        path="/contact" 
        element={
          <SystemState 
            imageSrc={MaintenanceImg} 
            title='Feature in' 
            highlight='Progress' 
            message="We're crafting something exceptional behind the scenes.This experience will be ready for you very soon." 
            actionType='navigate' 
            actionLabel='Back to Home' 
            actionTo='/' 
          />
        } 
      />
      <Route 
        path="/search" 
        element={
          <SystemState 
            imageSrc={MaintenanceImg} 
            title='Feature in' 
            highlight='Progress' 
            message="We're crafting something exceptional behind the scenes.This experience will be ready for you very soon." 
            actionType='navigate' 
            actionLabel='Back to Home' 
            actionTo='/' 
          />
        } 
      />
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
