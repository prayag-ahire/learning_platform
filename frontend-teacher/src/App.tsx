import {Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/Navbar'
import UserNav from './components/UserBar'
import { DashBoard } from './components/Dashbord'
import LiveClass from './components/liveClass'
import { LoginPage } from './components/loginPage'
import { SignupPage } from './components/signupPage'
import { Students } from './components/students'
import { LiveClass2 } from './components/liveClass2'
import { Materials } from './components/materials'

function App() {
  

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <header>
          <div className='flex h-16 items-center my-3 justify-between'>
            <NavBar/>
            <div className='flex mx-4 '>
              <UserNav/>
            </div>
          </div>
        </header>
      

        <Routes>
          <Route path='/' element={<DashBoard/>}/>
          <Route path='/live-class' element={<LiveClass2/>}/>
          <Route path='/startlive' element={<LiveClass/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/students' element={<Students/>}/>
          <Route path='/materials' element={<Materials/>}/>
        </Routes>
     
      </div>
    </>
  )
}

export default App
