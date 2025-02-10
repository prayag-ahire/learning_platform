import axios from 'axios'
import './App.css'
import { useState } from 'react'
import { Navbar } from './components/Appbar';


function App() {

const [ans,setAns] = useState("");

const handler = async ()=>{
  const response = await axios.get("https://learning-platform-1oks.onrender.com/api/v1/user");
  setAns(JSON.stringify(response.data,null,2));
}
  return (
    <>
      <div>
        <div className='border-1 h-18'><Navbar/></div>
        
      </div>
    </>
  )
}

export default App
