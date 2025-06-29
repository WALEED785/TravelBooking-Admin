import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/common/Layout';
import { routes } from './routes';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Routes>
            {routes.map((route, index) => (
              <Route 
                key={index} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;