import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Account from './components/Account';
import Popular from './components/Popular';
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount/>} />
      <Route path="/account" element={<Account/>}/>
      <Route path="/popular" element={<Popular/>}/>
    </Routes>
  )
}

export default App;
