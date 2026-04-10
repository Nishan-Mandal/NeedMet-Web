import { useState } from 'react'
import './App.css'
import { Header, Footer, ScrollToTop } from './components'
import { Outlet } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ScrollToTop />
      <Header />
        <main>
          <Outlet />
        </main>
      <Footer />
    </>
  )
}

export default App;
