import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCreditCard } from "react-icons/fa6";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { toast } from 'react-hot-toast';
import gpay from './../../../assets/gpay.png';
import phonepe from './../../../assets/phonepe.png';
import upi from './../../../assets/upi.svg';
import './payment.css';

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handlePayment = async () => {
    if (!selectedOption) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing payment...');

    try {
      // Simulating API call for payment processing
      // Replace this with your actual payment gateway integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Payment method specific handling
      switch (selectedOption) {
        case 'card':
          // Redirect to credit card form or open modal
          processCardPayment();
          break;
        case 'banking':
          // Redirect to banking gateway
          processBankingPayment();
          break;
        case 'gpay':
          // Open Google Pay integration
          processGpayPayment();
          break;
        case 'phonepe':
          // Open PhonePe integration
          processPhonePePayment();
          break;
        default:
          throw new Error('Invalid payment method');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.dismiss();
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Payment processing methods - replace with actual integration code
  const processCardPayment = () => {
    // Here you would integrate with a payment gateway like Stripe, Razorpay, etc.
    // For example with Stripe:
    // const stripe = await loadStripe('your_stripe_key');
    // const { error } = await stripe.redirectToCheckout({ sessionId });
    
    // Simulating success for demo
    toast.dismiss();
    toast.success('Card payment successful!');
    setTimeout(() => navigate('/success'), 1500);
  };

  const processBankingPayment = () => {
    // Redirect to banking portal
    toast.dismiss();
    toast.success('Redirecting to your bank...');
    // window.location.href = 'your_banking_gateway_url';
    setTimeout(() => navigate('/success'), 1500);
  };

  const processGpayPayment = () => {
    toast.dismiss();
    toast.success('Google Pay payment successful!');
    setTimeout(() => navigate('/success'), 1500);
  };

  const processPhonePePayment = () => {
    toast.dismiss();
    toast.success('PhonePe payment successful!');
    setTimeout(() => navigate('/success'), 1500);
  };

  return (
    <div className="container">
      
      <div className="progress-container">
        <div className="header">
          <h1 className="title">Add Shop</h1>
        </div>
        <div className='progress-steps'>
          <div className="step-item">
            <div className="step-circle active" onClick={() => {navigate('/store')}}>1</div>
          </div>
          <div className="dot active"></div>
          <div className="dot active"></div>
          <div className="dot active"></div>
          <div className="step-item">
            <div className="step-circle active" onClick={() => {navigate('/business')}}>2</div>
          </div>
          <div className="dot active"></div>
          <div className="dot active"></div>
          <div className="dot active"></div>
          <div className="step-item">
            <div className="step-circle active" onClick={() => {navigate('/package')}}>3</div>
          </div>
          <div className="dot active"></div>
          <div className="dot active"></div>
          <div className="dot active"></div>
          <div className="step-item">
            <div className="step-circle active" onClick={() => {navigate('/payment')}}>4</div>
          </div>
        </div>

        <div className="progress-container-text">
          <span className="step-label">Store Details</span>
          <span className="step-label">Business Details</span>
          <span className="step-label">Package Selection</span>
          <span className="step-label">Payment</span>
        </div>
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

      <div className="button-container-step-pay">
        <Link to='/package' style={{ textDecoration: "none" }}>
          <button 
            type="button" 
            className="back-button" 
            disabled={isProcessing}
          >
            <MdOutlineKeyboardBackspace size={24} className="arrow-icon-back" /> Back 
          </button>
        </Link>
        <button 
          className="next-button" 
          onClick={handlePayment} 
          disabled={isProcessing}
        >
          {isProcessing ? (
            'Processing...'
          ) : (
            <>
               Pay Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Payment;