import axios from 'axios'
import './App.css'
import { useState } from 'react'

function App() {

const [ans,setAns] = useState("");

const handler = async ()=>{
  const response = await axios.get("https://learning-platform-1oks.onrender.com/api/v1/user");
  setAns(JSON.stringify(response.data,null,2));
}
  return (
    <>
      <div className='text-center text-3xl mt-10 '> welcome to learn with learning-platform.</div>
      <button className='bg-blue-500 text-white px-4 py-2 rounded mt-5' onClick={handler}>Click me</button>
      <button onClick={()=>{
        
      }}></button>
      <div>{ans}hahah</div>
    </>
  )
}

export default App
