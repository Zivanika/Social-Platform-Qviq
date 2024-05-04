import "./App.css";
import { app } from "./firebase";
import Login from './components/Login';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useState } from "react";
import BEE from "./components/BEE";
import Profile from "./components/Profile";

function App() {
  const [credentials, setCredentials] = useState({ number: "", email: "", password: "" });
  const [image, setImage]=useState("");

  return (
    <BrowserRouter>
    <div className="h-[100vh] flex justify-center items-center">
      {/* <BEE image={image}/> */}
      <Routes>
        <Route exact path="/Social-Platform-Qviq" element={<Login credentials={credentials} setCredentials={setCredentials} setImage={setImage}/>}/>
        <Route exact path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
