import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./theme/colors.css"
import "./theme/typography.css"
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { 
  Home, 
  ListingDetails, 
  ListingsPage, 
  AllCategory, 
  LegalPage,
  SearchPage,
  SignUp,
  LogIn,
} from './pages'
import { SystemState } from './components'
import MaintenanceImg from "./assets/maintenance.jpg"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProvider } from './contexts/AppProvider.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} /> 
      <Route path='listing/:listingId' element={<ListingDetails />} />
      <Route path="/listings/similar/:listingId" element={<ListingsPage />} />
      <Route path="/listings/:type" element={<ListingsPage />} />
      <Route path="/listings/category/:category_name" element={<ListingsPage />} />
      <Route path="/all_categories" element={<AllCategory />} />
      <Route path="/:legalDocument" element={<LegalPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
    </Route>
  )

)

const queryClient = new QueryClient({
 defaultOptions: {
   queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000
   }
 }
});

createRoot(document.getElementById('root')).render(
  <>
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </AppProvider>
  </>
)
