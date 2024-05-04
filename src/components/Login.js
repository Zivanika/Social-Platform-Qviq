import React, { useRef, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import BEE from './BEE';
import { app } from '../firebase';
import BarLoader from "./BarLoader";
import ErrorMessage from './ErrorMessage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getDatabase,ref,set, } from "firebase/database";
import Google from './Google';
const baseURL="http://localhost:5000"

const Login = (props) => {
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    // const db = getDatabase(app);
    // const putData = (key, data) => {
    //     set(ref(db, key), data);
    //   };
    const refContainer = useRef(null);
    const [busy, setBusy] = useState(false);
    const [isNumberEmpty, setIsNumberEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isNumberFocused, setNumberFocus] = useState(false);
    const [isPWDEmpty, setIsPWDEmpty] = useState(false);
    const [isPWDFocused, setPWDFocus] = useState(false);
    let navigate = useNavigate(); //New version of useHistory

    const handleChange = (e)=>{
        props.setCredentials({ ...props.credentials, [e.target.name]: e.target.value });
        if (e.target.name === 'number') {
            setIsNumberEmpty(e.target.value.trim() === '')
        }
        if (e.target.name === 'email') {
            setIsEmailEmpty(e.target.value.trim() === '')
        }
        if (e.target.name === 'password') {
            setIsPWDEmpty(e.target.value.trim() === '')
        }
    }
    const handleBlur = (e) => {
        // Check if the input is empty on blur and update the class
        if (e.target.name === 'number') {
            setIsNumberEmpty(e.target.value.trim() === '')
            setNumberFocus(false);
        }
        if (e.target.name === 'password') {
            setIsPWDEmpty(e.target.value.trim() === '')
            setPWDFocus(false);
        }
      };
      const handleFocus = (e) => {
        if (e.target.name === 'number') {
            setNumberFocus(true);
        }
        if (e.target.name === 'password') {
            setPWDFocus(true);
        }
      };

    const handleSignInOverlayClick = () => {
        refContainer.current.classList.remove('right-panel-active');
    }
    const handleSignUpOverlayClick = async () => {
        refContainer.current.classList.add('right-panel-active');

    }
    const signinWithGoogle = async(e)=>{
        signInWithPopup(auth,googleProvider).then((val)=>navigate("/profile")).catch((err)=>{console.log(err);})
    }
    const handleSignInClick = async (e) => {
        e.preventDefault();
        try {
            setBusy(true);
                signInWithEmailAndPassword(auth,props.credentials.email,props.credentials.password).then((value)=>console.log("Sign Up Successfull")).catch((err)=>console.log(err))
                const response = await fetch(`${baseURL}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email: props.credentials.email, password: props.credentials.password })
                });
                const json = await response.json();
                // console.log(json)
                if (json.success) {
                    //!Redirect
                    localStorage.setItem('token', json.authtoken);
                    navigate("/");
                }
                setBusy(false);
            }
            catch (error) {
                setBusy(false);
                console.error('Error fetching notes:', error);
            }
        }
        const handleSignUpClick = async (e) => {
            e.preventDefault();
            try {
                setBusy(true);
                createUserWithEmailAndPassword(auth,props.credentials.email,props.credentials.password).then((value)=>console.log("Sign Up Successfull")).catch((err)=>console.log(err))
                // putData('users/' + props.credentials.name, {
                //     email: props.credentials.email,
                //     password: props.credentials.password
                //   });
                const response = await fetch(`${baseURL}/api/auth/createuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        number:props.credentials.number, 
                        email: props.credentials.email, 
                        password: props.credentials.password,
                        type:selectedOption,
                        gender:gender,
                        image:selectedImage64
                     })
                });
                const json = await response.json();
                if (json.success) {
                    //!Redirect
                    localStorage.setItem('token', json.authtoken);
                    setBusy(false)
                    navigate("/profile")
                }
                else {
                    console.log(json);
                }
        }
        catch (error) {
            setBusy(false);
            console.error('Error fetching notes:', error);
        }
    }
  
        const [isOpen, setIsOpen] = useState(false);
        const [selectedOption, setSelectedOption] = useState('User Type');
        const [selectedImage64, setSelectedImage64] = useState("");
        const [gender,setGender]=useState("")
      
        const toggleMenu = () => {
          setIsOpen(!isOpen);
        };
      
        const selectOption = (option) => {
          setSelectedOption(option);
          setIsOpen(false);
        };
        const handleRadioChange = (event)=>{
            setGender(event.target.id)
        }
        const handleImageChange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setSelectedImage64(reader.result);
                props.setImage(reader.result)
            };
            reader.onerror=(err)=>{
                console.log("Error:",err);
            }
        };
    return (
        <>
        <BEE image={selectedImage64}/>
        <div className='flex justify-center items-center py-2 '>
            <div className="Logincontainer" ref={refContainer} id="container">

                <div className="form-container sign-up-container">

                    <form action="/">

                        {/* <h1 className='text-3xl py-3 font-semibold  text-center'>Create Account</h1> */}


                        <input className={`field ${isNumberEmpty && props.credentials.number.length < 3 ? 'invalidInput' : ''} loginInputExtended rounded-lg`} type="number" name="number" value={props.credentials.number} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} minLength={10} required placeholder="Phone Number" />
                    

                        <input className={`field ${isEmailEmpty ? 'invalidInput' : ''} loginInputExtended rounded-lg`} type="email" name='email' value={props.credentials.email} onChange={handleChange} onBlur={handleBlur} required placeholder="Email" />
                        <input className={`field ${isPWDEmpty && props.credentials.password.length < 5 ? 'invalidInput' : ''} loginInputExtended rounded-lg`} type="password" name='password' value={props.credentials.password} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} minLength={5} required placeholder="Password" />
                        {(isPWDEmpty && !isPWDFocused) || (props.credentials.password.length < 5 && isPWDFocused) && (
                            <ErrorMessage msg='Password must be greater than 5 characters long!' />)}
                        {busy && <BarLoader/>}
                            <div className='dropdown my-2'>
                                <div className='select' onClick={toggleMenu}>
                                    <div className='selected'>{selectedOption}</div>
                                    <div className={`caret ${isOpen ? 'caret-rotate' : ''}`}></div>
                                </div>
                                <ul className={`menu ${isOpen ? 'menu-open' : ''}`}>
                                    <li onClick={() => selectOption('Free')}>Free</li>
                                    <li onClick={() => selectOption('Developer')}>Developer</li>
                                    <li onClick={() => selectOption('Premium')}>Premium</li>
                                    <li onClick={() => selectOption('Business')}>Business</li>
                                </ul>
                            </div>
                            <div className="image-input my-2">
                                <input type="file" accept="image/*" id="imageInput"  onChange={handleImageChange}/>
                                <label htmlFor="imageInput" className="image-button"><i className="far fa-image"></i> Choose image</label>
                                {/* {selectedImage?<p className='m-2 font-semibold'>{selectedImage.name}</p>:""} */}
                            </div>
                            <div className=' font-medium flex justify-center items-center gap-2 mt-2'>Gender: 
                                <label htmlFor="male"><input type="radio" name="gender" id="male" className='mx-1' onChange={handleRadioChange}/>Male</label>
                                <label htmlFor="female"><input type="radio" name="gender" id="female" className='mx-1' onChange={handleRadioChange}/>Female</label>
                            </div>
                 
                        <div className="social-container" onClick={signinWithGoogle}>
                            <Google/>
                           
                        </div >
                        <button disabled={ busy || (props.credentials.number.length<3 || props.credentials.password.length<5)} className=' hover:bg-[#ff2b2b]' onClick={handleSignUpClick}>Sign Up</button>

                    </form >

                </div >

                <div className="form-container sign-in-container">

                    <form action="/">

                        <h1 className='text-4xl font-semibold'>Sign in</h1>

                        <div className="social-container" onClick={signinWithGoogle}>

                        </div>

                        <input className={`field ${isEmailEmpty ? 'invalidInput' : ''} loginInputExtended rounded-lg`} type="email" name='email' value={props.credentials.email} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} placeholder="Email" />
                        <input className={`field ${isPWDEmpty && props.credentials.password.length < 5 ? 'invalidInput' : ''} loginInputExtended rounded-lg`} type="password" name='password' value={props.credentials.password} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} placeholder="Password" />
                        {(isPWDEmpty && !isPWDFocused) || (props.credentials.password.length < 5 && isPWDFocused) && (
                            <ErrorMessage msg='Password must be greater than 5 characters long!' />)}
                        <Link to="/forgot-password" className='font-medium text-slate-500 hover:text-red-400'>Forgot your password?</Link>
                        {busy && <BarLoader/>}
                        <button disabled={busy || (props.credentials.email.length<7 || props.credentials.password.length<5)} className='hover:bg-[#ff2b2b]' onClick={handleSignInClick}>Sign In</button>

                    </form >
                    </div >

                <div className="overlay-container">

                    <div className="overlay">

                        <div className="overlay-panel overlay-left">

                            <h1 className='text-4xl'> Hello, Friend!</h1 >

                            <p className='font-medium'>Begin your note-taking journey by providing your personal details.</p>

                            <button onClick={handleSignInOverlayClick} className="ghost btn" id="signIn">Sign In</button>

                        </div >

                        <div className="overlay-panel overlay-right" >

                            <h1 className='text-4xl'> Welcome Back! </h1>

                            <p>Log in with your information to access your valuable notes.</p>

                            <button onClick={handleSignUpOverlayClick} className="ghost btn" id="signUp">Sign Up</button>

                        </div >

                    </div >

                </div >

            </div >

        </div>
        </>
    )
}

export default Login