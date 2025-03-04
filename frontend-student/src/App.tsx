
import { Routes , Route} from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Appbar'
import UserNav from './components/UserNav'
import { DashBoard } from './components/DashBoard'
import { LiveClass } from './components/liveClass'
import UserProfile from './components/profile/userProfile'
import { SignupPage } from './components/SignupPage'




function App() {

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <header className='border-b'>
        <div className='flex h-16 items-center  px-4'>
          <Navbar/>
        <div className="ml-auto flex items-center space-x-4 ">
          <UserNav/>
          </div>
        </div>
        </header>
        <Routes>
            <Route path='/' element={<DashBoard/>} />
            <Route path='/live-class' element={<LiveClass/>}/>
            <Route path='/profile' element={<UserProfile/>} />
            <Route path='/signup' element={<SignupPage/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
