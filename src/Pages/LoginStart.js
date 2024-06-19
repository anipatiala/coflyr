import { RecaptchaVerifier, browserSessionPersistence, onAuthStateChanged, setPersistence, signInWithPhoneNumber, updateProfile } from "firebase/auth";

import { authentication } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import "../App.css"
import { useState } from "react";

export default function LoginStart(){

    const confirmationResult = Object();
    const navigate = useNavigate();

    const [isRequestOTP, setIsRequestOTP] = useState(true)
    const [isVerifyOTP, setIsVerifyOTP] = useState(false)
    const [isUserProgile, setIsUserProgile] = useState(false)
    const [signinStatus, setSigninStatus] = useState("Please provide your 10 Digit Mobile Number.")
    
    
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOTP] = useState("")
    const [userName, setUserName] = useState("")
    const[email, setEmail] = useState("")

    
    const handleRequestOTP = ()=>{
        setSigninStatus("Please Wait....")
        window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                
            }
        });
        
        const appVerifier = window.recaptchaVerifier;
        
        setPersistence(authentication, browserSessionPersistence).then(()=>{
            signInWithPhoneNumber(authentication, "+91"+phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log(confirmationResult);
                setIsRequestOTP(false);
                setIsVerifyOTP(true);
                setSigninStatus("Please Enter 6 Digit OTP received on your phone")
            }).catch((error) => {
                setSigninStatus("There is an error in loggin in. Please Try Again: "+error)
            });
        }).catch((error) => {
            setSigninStatus("There is an error in loggin in. Please Try Again: "+error)
        });
        
      
    }

    const handleOtp = ()=>{
        window.confirmationResult.confirm(otp).then((result) => {
            onAuthStateChanged(authentication, (user) => {
                if (user) {
                    console.log(user)
                    if (!(user.displayName)){
                        setIsVerifyOTP(false);
                        setIsUserProgile(true);
                    }
                    else{
                        navigate('/');
                    }
                }
                else{
                    setSigninStatus("There is an error in loggin in. Please Try Again");
                }
            });
        }).catch((error) => {
            setSigninStatus("There is an error in loggin in. Please Try Again: "+error)
        });
    }

    const handleProfile = async()=>{
        if (userName.length < 10 && email.length < 10){
            setSigninStatus("Please Provide Valid Name and Email")
        }
        else{
            let data = {displayName: userName + " ("+email+")"};
            console.log(data);
            await updateProfile(authentication.currentUser, data)
            navigate('/');
        }
        
    }

    const handlePhoneChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleOtpChange  = (event) => {
        setOTP(event.target.value);
    };

    const handleNameChange  = (event) => {
        setUserName(event.target.value);
    };

    const handleEmailChange  = (event) => {
        setEmail(event.target.value);
    };

   
    
    return (
        <div>
            { isRequestOTP && (
            <section id="contact" className="contact section-bg">
                <div className="container">
                    <div className="section-title">
                        <h2>Sign in</h2>
                        <p>Sign in or sign up for a free Coflyr account with your registered phone number.</p>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">

                        </div>

                        <div class="col-lg-4 mt-4 mt-lg-0">
                            <div class="php-email-form" onSubmit="event.preventDefault()">
                                <div class="form-group mt-3">
                                    <input type="text" maxLength={10} value={phoneNumber} class="form-control" name="phoneNumber" id="phoneNumber" placeholder="Phone Number (10 Digits)" onChange={handlePhoneChange} required />
                                </div>
                                <div class="form-group mt-3 section" >
                                    <div id="sign-in-button" style={{height: "100 px"}}></div>
                                </div>
                                <div class="form-group mt-3 section-title" >
                                    <p>{signinStatus}</p>
                                </div>
                                <div class="text-center"><button className="button-login" onClick={handleRequestOTP}>Request OTP</button></div>
                            </div>
                        </div>
                        <div className="col-lg-4">

                        </div>

                    </div>
                </div>
            </section>)}
            { isVerifyOTP && (
            <section id="contact" className="contact section-bg">
                <div className="container">
                    <div className="section-title">
                        <h2>Sign In/Up</h2>
                        <p>Sign in or sign up for a free Coflyr account with your registered phone number.</p>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">

                        </div>

                        <div class="col-lg-4 mt-4 mt-lg-0">
                            <div class="php-email-form" onSubmit="event.preventDefault()">
                                <div class="form-group mt-3">
                                    <input type="text" maxLength={6} defaultValue={otp} class="form-control" name="otp" id="otp" placeholder="One Time Password (6 Digits)" onChange={handleOtpChange} required />
                                </div>
                                <div class="form-group mt-3 section" >
                                    <div id="sign-in-button" style={{height: "100 px"}}></div>
                                </div>
                                <div class="form-group mt-3 section-title" >
                                    <p>{signinStatus}</p>
                                </div>
                                <div class="text-center"><button className="button-login" onClick={handleOtp}>Verify OTP</button></div>
                            </div>
                        </div>
                        <div className="col-lg-4">

                        </div>

                    </div>

                </div>
            </section>)}

            { isUserProgile && (
            <section id="contact" className="contact section-bg">
                <div className="container">
                    <div className="section-title">
                        <h2>Sign in</h2>
                        <p>Please provide your full name and email address.</p>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">

                        </div>

                        <div class="col-lg-4 mt-4 mt-lg-0">
                            <div class="php-email-form" onSubmit="event.preventDefault()">
                                <div class="form-group mt-3">
                                    <input type="text" defaultValue={userName} class="form-control" name="userName" id="userName" placeholder="Enter Your Name" onChange={handleNameChange} required />
                                </div>
                                <div class="form-group mt-3">
                                    <input type="email" defaultValue={email} class="form-control" name="email" id="email" placeholder="Enter your Email Id" onChange={handleEmailChange} required />
                                </div>
                                <div class="form-group mt-3 section-title" >
                                    <p>{signinStatus}</p>
                                </div>
                                <div class="text-center"><button className="button-login" onClick={handleProfile}>Add Details</button></div>
                            </div>
                        </div>
                        <div className="col-lg-4">

                        </div>

                    </div>

                </div>
            </section>)}
        </div>
    );
}