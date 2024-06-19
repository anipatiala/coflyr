import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { authentication } from './firebase_config';
import {BrowseRouter, BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import LoginStart from './Pages/LoginStart';

function App() {
  return (
   <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginStart />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
