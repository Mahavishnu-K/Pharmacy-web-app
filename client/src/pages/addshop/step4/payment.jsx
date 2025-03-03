import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard } from "react-icons/fa6";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import gpay from './../../../assets/gpay.png';
import phonepe from './../../../assets/phonepe.png';
import upi from './../../../assets/upi.svg';
import './payment.css';

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      
      <div className="header">
        <h1 className="title">Add Shop</h1>
        <div className="spacer"></div>
      </div>

      
        <div className="progress-container">
            <div className="step-item">
                <div className="step-circle active">1</div>
            </div>

            <div className="dot active"></div>
            <div className="dot active"></div>
            <div className="dot active"></div>

            <div className="step-item">
                <div className="step-circle active">2</div>
            </div>
            
            <div className="dot active"></div>
            <div className="dot active"></div>
            <div className="dot active"></div>
            
            <div className="step-item">
                <div className="step-circle active">3</div>
            </div>
            
            <div className="dot active"></div>
            <div className="dot active"></div>
            <div className="dot active"></div>
            
            <div className="step-item">
                <div className="step-circle active">4</div>
            </div>
        </div>
        <div className="progress-container-text">
            <span className="step-label" >Store Details</span>
            <span className="step-label" style={{marginLeft:"5px"}}>Business Details</span>
            <span className="step-label">Package Selection</span>
            <span className="step-label" style={{marginTop:"-9px"}}>Payment</span>
        </div>

        <div className="payment-container">
          <h2 className="payment-title">Choose Payment Option</h2>
          
          <div 
            className={`payment-option ${selectedOption === 'card' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('card')}
          >
            <div className="option-label">Debit / Credit card</div>
            <div className="option-icon card-icon">
              <FaCreditCard />
            </div>
          </div>
          
          <div 
            className={`payment-option ${selectedOption === 'banking' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('banking')}
          >
            <div className="option-label">Internet Banking</div>
            <div className="option-icon banking-icon">
              <BsBank2 />
            </div>
          </div>
          
          <div 
            className={`payment-option ${selectedOption === 'gpay' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('gpay')}
          >
            <div className="option-label">
              <img src={gpay} className="gpay" alt="google pay icon" />
            </div>
            <img src={upi} className="upi" alt="upi icon" />
          </div>
          
          <div 
            className={`payment-option ${selectedOption === 'phonepe' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('phonepe')}
          >
            <div className="option-label">
              <div className="phonepe-logo">
                <img src={phonepe} className="phonepe" alt="phone pay icon" />
              </div>
            </div>
            <img src={upi} className="upi" alt="upi icon" />
          </div>
        </div>

        <div className="button-container-step">
            <Link to='/package' style={{ textDecoration: "none" }}>
              <button type="button" className="back-button">
              <MdOutlineKeyboardBackspace size={24} className="arrow-icon-back" /> Back 
              </button>
            </Link>
            <button className="next-button">
              Done
            </button>
        </div>
    </div>
  );
}

export default Payment