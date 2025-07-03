import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import { routes } from './routes';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <ThemeProvider> {/* Wrap everything with ThemeProvider */}
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children?.map((childRoute, childIndex) => (
                  <Route 
                    key={childIndex} 
                    path={childRoute.path} 
                    element={childRoute.element} 
                  />
                ))}
              </Route>
            ))}
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;