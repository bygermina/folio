import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from './layout';
import HomePage from '../pages/home';

const AnimationsPage = lazy(() => import('../pages/animations'));
const DataIntensivePage = lazy(() => import('../pages/data-intensive'));
const ChartsPage = lazy(() => import('../pages/charts'));

const App = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/animations" element={<AnimationsPage />} />
          <Route path="/data-intensive" element={<DataIntensivePage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
