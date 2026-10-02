import React from 'react'
import { Routes,Route } from 'react-router-dom'
import SignUp from './pages/signUp'
import LogIn from './pages/logIn'

const App = () => {
  return (
   <Routes>
      <Route path='/signup' element={<SignUp />} />
    <Route path='/login' element={<LogIn />} />
    {/* <Route path='*' element={<LogIn />} /> */}
   </Routes>
  )
}

export default App
