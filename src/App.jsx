import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Layout from './components/Layout';
import SFACMain from './pages/SFACMain';
import Contributors from './pages/Contributor';
import Home from './pages/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        <Routes>
          {/* Home without layout (optional) */}
          <Route path='/' element={<Home />} />
           {/* Pages WITH layout */}

          <Route 
            path='/admissions' 
            element={
              <Layout>
                <SFACMain />
              </Layout>
              } />
          <Route 
            path='/contributor' 
            element={
              <Layout>
                <Contributors />
              </Layout>
            } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
