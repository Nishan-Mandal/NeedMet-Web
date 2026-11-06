import { Suspense } from 'react';
import { Header, Footer, ScrollToTop, Loader } from './components';
import { Outlet, useLocation } from 'react-router-dom';
import Admin from './admin/admin';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Treat Admin site as an individual app inside the main app
  if (isAdmin) {
    return <Admin />;
  }

  // Main customer-facing website application
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<Loader message="Loading..." />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
