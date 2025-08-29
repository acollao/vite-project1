import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import SFACAdmission from './pages/SFACAdmission.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        <SFACAdmission />
      </div>
    </>
  )
}

export default App
