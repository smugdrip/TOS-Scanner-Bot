import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Account from './components/Account';
import Popular from './components/Popular';
import Worst from './components/Worst';
import Best from './components/Best';
import Test from './components/Test';
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount/>} />
      <Route path="/account" element={<Account/>}/>
      <Route path="/popular" element={<Popular/>}/>
      <Route path="/worst" element={<Worst/>}/>
      <Route path="/best" element={<Best/>}/>
      <Route path="/test" element={<Test/>}/>
    </Routes>
  )
}

export default App;
