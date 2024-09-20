import React from 'react'
import Todo from './components/todo1'
import Savepage from './components/savedata'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
        <Router>
   
      <Routes>
        <Route path="/" element={<Todo/>}/>
        <Route path="/savedatapage" element={<Savepage/>}/>
      
      </Routes>
    </Router>
    </div>
  )
}

export default App