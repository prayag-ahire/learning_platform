import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/Navbar'
import UserNav from './components/UserBar'
import Dashbord from './components/Dashbord'


function App() {
  

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <header className='border-b'>
          <div className='flex h-16 items-center justify-between'>
            <NavBar/>
            <div className='flex mx-4 '>
              <UserNav/>
            </div>
          </div>
        </header>
      
        <Routes>
          <Route path='/' element={<Dashbord/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
