import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import icon from '/icon.png';
import { account, databases, ID, DATABASE_ID, COLLECTION_ID } from './../../../appwriteConfig';
import { Permission, Role } from 'appwrite';
import './signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const validateFirstName = (value) => {
    if (!value.trim()) {
      setFirstNameError('First name is required');
      return false;
    } else {
      setFirstNameError('');
      return true;
    }
  };

  const validateLastName = (value) => {
    if (!value.trim()) {
      setLastNameError('Last name is required');
      return false;
    } else {
      setLastNameError('');
      return true;
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePhone = (value) => {
    if (!value) {
      setPhoneError('Phone number is required');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const validateForm = () => {
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    return isFirstNameValid && isLastNameValid && isEmailValid && 
           isPhoneValid && isPasswordValid && isConfirmPasswordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormSubmitted(true);
    
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {

      try {
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
          await account.deleteSession(session.$id);
        }
      } catch (sessionError) {
        console.log('No active sessions to clear');
      }

      const user = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
      console.log('User created:', user);

      await account.createEmailPasswordSession(email, password);

      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        firstName,
        lastName,
        email,
        phone
      },
      [
        Permission.read(Role.user(user.$id)), 
        Permission.update(Role.user(user.$id)), 
        Permission.delete(Role.user(user.$id))
      ]);

      navigate('/store')
    } catch (err) {
      console.error('Signup error:', err);
      
      if (err.code === 409) {
        setEmailError('Email already exists');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-signup">
      <div className="signup-con-signup">
        <div className="login-card-signup">

          <div className="back-button-signup" onClick={() => navigate('/')}>
              <MdOutlineKeyboardBackspace size={24} />
          </div>
        
          <div className="logo-container-signup">
            <div className="logo-signup">
              <img src={icon} className="logo-img-signup" alt="pharmacy icon" />
            </div>
          </div>

          <h1 className="title-signup">Create an account</h1>
          <p className="subtitle-signup">Get started in a few steps</p>

          <form onSubmit={handleSubmit}>
            <div className="name-fields-signup">
              <div className="form-field-signup half-width-signup">
                <input
                  type="text"
                  id="first-name"
                  className={`inp ${firstNameError ? 'error-input' : ''}`}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
                <label htmlFor="first-name">First Name</label>
                {firstNameError && <div className="error-message">{firstNameError}</div>}
              </div>

              <div className="form-field-signup half-width-signup">
                <input
                  type="text"
                  id="last-name"
                  className={`inp ${lastNameError ? 'error-input' : ''}`}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
                <label htmlFor="last-name">Last Name</label>
                {lastNameError && <div className="error-message">{lastNameError}</div>}
              </div>
            </div>

            <div className="form-field-signup">
              <input
                type="email"
                id="email"
                className={`inp ${emailError ? 'error-input' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
              <label htmlFor="email">Email</label>
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            <div className="form-field-signup">
              <div className="phone-input-wrapper">
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="IN"
                  id="phone"
                  className={phoneError ? 'error-input' : ''}
                />
                <label htmlFor="phone">Phone</label>
              </div>
              {phoneError && <div className="error-message">{phoneError}</div>}
            </div>

            <div className="form-field-signup">
              <div className="password-input-wrapper-signup">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  className={`inp ${passwordError ? 'error-input' : ''}`}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="toggle-password-signup"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="eye-icon-signup">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="eye-icon-signup">
                      <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            <div className="form-field-signup">
              <div className="password-input-wrapper-signup">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  className={`inp ${confirmPasswordError ? 'error-input' : ''}`}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <label htmlFor="confirm-password">Confirm Password</label>
                <button
                  type="button"
                  className="toggle-password-signup"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" className="eye-icon-signup">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="eye-icon-signup">
                      <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
            </div>

            <button type="submit" className="login-button-signup" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="signup-prompt-signup">
            <p>Already have an account? <Link to="/">Log In</Link></p>
          </div>

          <div className="divider-signup">
            <span className="divider-line-signup"></span>
            <span className="divider-text-signup">Or sign up with</span>
            <span className="divider-line-signup"></span>
          </div>

          <button className="google-login-signup">
            <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" className="google-icon-signup" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;