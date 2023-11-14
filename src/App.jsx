import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Status from './pages/Status'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/status' element={<Status/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
