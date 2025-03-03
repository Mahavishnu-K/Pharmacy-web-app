import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Signup from './pages/signup/signup'
import Store from './pages/addshop/step1/store'
import Business from './pages/addshop/step2/business'
import Package from './pages/addshop/step3/package'
import Payment from './pages/addshop/step4/payment'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Store />} />
          <Route path="/business" element={<Business />} />
          <Route path="/package" element={<Package />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App