import { Suspense } from 'react';
import { Header, Footer, ScrollToTop, Loader } from './components';
import { Outlet } from 'react-router-dom';

function App() {
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
