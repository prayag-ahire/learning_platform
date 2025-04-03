
import { Routes , Route} from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Appbar'
import UserNav from './components/UserNav'
import { DashBoard } from './components/DashBoard'
import  LiveClass  from './components/liveClass'
import UserProfile from './components/profile/userProfile'
import { SignupPage } from './components/SignupPage'
import Teacher from './components/Teacher'
import { LoginPage } from './components/loginPage'
import { LiveClass2 } from './components/liveClass2'




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
            <Route path='/startlive' element={<LiveClass/>}/>
            <Route path='/profile' element={<UserProfile/>} />
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/teachers' element={<Teacher/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='live-class' element={<LiveClass2/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
