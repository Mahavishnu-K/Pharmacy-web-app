import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { account } from './../../../appwriteConfig';
import { encryptData, decryptData } from '../../utils/encryption';
import icon from '/icon.png'
import './login.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const mail = localStorage.getItem('rem-email');
        const pass = localStorage.getItem('rem-password');
        if(mail && pass){
            const decryptedMail = decryptData(mail);
            const decryptedPassword = decryptData(pass);
            setEmail(decryptedMail);
            setPassword(decryptedPassword);
            setRememberMe(true);
        }
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            try {
                const sessions = await account.listSessions();
                for (const session of sessions.sessions) {
                    await account.deleteSession(session.$id);
                }
            } catch (sessionError) {
                console.log('No active sessions to clear');
            }

            const session = await account.createEmailPasswordSession(email, password);
            if(rememberMe){
                localStorage.setItem("rem-email",encryptData(email));
                localStorage.setItem("rem-password",encryptData(password));
            }else {
                localStorage.removeItem("rem-email");
                localStorage.removeItem("rem-password");
            }
            console.log('Login successful:', session);
            navigate('/store');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error('Login failed:', err);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className='logo-con'>
                    <div className="login-card">
                        <div className="logo-container">
                        <div className="logo">
                            <img src={icon} className='logo-img' alt="pharmacy icon" />
                        </div>
                        </div>

                        <h1 className="title">Log in</h1>
                        <p className="subtitle">login to your account</p>
                        <form onSubmit={handleSubmit} className='form'>
                            <div className="form-field">
                                <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='email-inp'
                                placeholder="Enter your email"
                                required
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="form-field">
                                <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    className='pass-inp'
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <label htmlFor="password">Password</label>
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                    <svg viewBox="0 0 24 24" className="eye-icon">
                                        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                    </svg>
                                    ) : (
                                    <svg viewBox="0 0 24 24" className="eye-icon">
                                        <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                                    </svg>
                                    )}
                                </button>
                                </div>
                            </div>
                        <div className="form-footer">
                            <div className="remember-me">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className="forgot-password">Forgot Password ?</a>
                        </div>

                        <button type="submit" className="login-button">Log In</button>

                        </form>

                        <div className="signup-prompt">
                            <p>New Here? <Link to="/signup">Create an account</Link></p>
                        </div>

                        <div className="social-login">
                            <div className="divider">
                                <span className="divider-line"></span>
                                <span className="divider-text">Or log in with</span>
                                <span className="divider-line"></span>
                            </div>
                            <button className="google-login">
                                <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" className="google-icon" />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login