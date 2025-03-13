import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Toaster, toast } from 'sonner';
import { databases, account, DATABASE_ID, COLLECTION_ID, Query } from '../../../../../server/src/appwriteConfig';
import { encryptData, decryptData } from '../../../utils/encryption';

import './package.css';

const Package = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState({
    planName: 'Basic',
    price: '₹50',
    features: 'Patient Management | Appointment Scheduling | Basic Reports'
  });
  const [initialData, setInitialData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  
  const plans = [
    {
      planName: 'Basic',
      price: '₹50',
      features: 'Patient Management | Appointment Scheduling | Basic Reports'
    },
    {
      planName: 'Premium',
      price: '₹80',
      features: 'Multi-Doctor Support | Insurance Claim Processing | Advanced EMR'
    },
    {
      planName: 'Platinum',
      price: '₹120',
      features: 'AI Diagnosis | Telemedicine | Pharmacy Management'
    }
  ];
  
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowOverlay(false);
    setHasChanges(true);
    sessionStorage.setItem("selectedPlan", encryptData(plan));
  };

  const handleReferralChange = (e) => {
    setReferralCode(e.target.value);
    setHasChanges(true);
    sessionStorage.setItem("referralCode", encryptData(e.target.value));
  };

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("selectedPlan");
    const storedReferral = sessionStorage.getItem("referralCode");

    if (storedPlan) {
      setSelectedPlan(decryptData(storedPlan));
      setInitialData(decryptData(storedPlan));
    }

    if (storedReferral) {
      setReferralCode(decryptData(storedReferral));
    }

    const fetchExistingDocument = async () => {
      try {
        const user = await account.get();
        const userId = user.$id;

        if (!userId) {
          console.log("User not logged in!");
          return;
        }

        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID, 
          [Query.equal('userId', [userId])]
        );

        if (response.documents.length > 0) {
          setDocumentId(response.documents[0].$id); 
        }
      } catch (err) {
        console.error("Error fetching existing document:", err);
      }
    };

    fetchExistingDocument();
  }, []);
  
  const handleOverlayClick = (e) => {
    if (e.target.className === 'overlay') {
      setShowOverlay(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges && initialData) {
      navigate('/payment');
      return;
    }

    const user = await account.get();
    const userId = user.$id;

    if (!userId) {
      return;
    }

    try {
      const priceValue = parseInt(selectedPlan.price.replace('₹', '').trim());

      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID, 
        documentId,
        {
          planName: selectedPlan.planName,
          price: priceValue,
          referralCode: referralCode
        }
      );

      console.log('Package saved:', response);
      setInitialData({ selectedPlan, referralCode });
      setHasChanges(false);
      setDocumentId(response.$id); 
      navigate('/payment');
    } catch (error) {
      toast.error('Error');
      console.error('Error saving package details:', error);
    } finally {
      toast.success('Proceed to pay');
    }
  };
  
  return (
    <div className="container">

      <Toaster position="bottom-center" />
      
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
            
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            
            <div className="step-item">
                <div className="step-circle">4</div>
            </div>
        </div>
        <div className="progress-container-text-pack">
          <span className="step-label" style={{ marginLeft: "5px" }}>Store Details</span>
          <span className="step-label" style={{ marginLeft: "5px" }}>Business Details</span>
          <span className="step-label" style={{ marginLeft: "2px" }}>Package Selection</span>
          <span className="step-label" style={{ marginTop: "-9px" }}>Payment</span>
        </div>

      
      <form onSubmit={handleSubmit}>
          <div className="package-container">
          <div className="package-section">
            <label htmlFor="package">
              Package <span className="required">*</span>
            </label>
            <div className="package-card">
              <div className="package-info">
                <div className="package-name">{selectedPlan.planName}</div>
                <div className="package-price"><span style={{fontSize:"16px",fontWeight:"550"}}>{selectedPlan.price}</span>/month</div>
              </div>
              <button 
                type="button" 
                className="choose-plan-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowOverlay(true);
                }}
              >
                Choose Plan
              </button>
            </div>
          </div>

          <div className="referral-section">
            <label htmlFor="referralCode">Referral Code (Optional)</label>
            <input
              type="text"
              id="referralCode"
              className="referral-input"
              value={referralCode}
              onChange={handleReferralChange}
              placeholder="Enter referral code"
            />
          </div>

          <div className="summary-section">
            <div className='summary-title-con'>
              <h3 className="summary-title">Summary</h3>
            </div>
            <div className="summary-item">
              <span className="item-name">Onboarding Fee (One Time)</span>
              <span className="item-price" style={{fontSize:"16px",fontWeight:"550"}}>₹100</span>
            </div>

            <div className="summary-item">
              <span className="item-name">{selectedPlan.planName} Plan X 3 Months</span>
              <span className="item-price" style={{fontSize:"16px",fontWeight:"550"}}>
                ₹{(parseInt(selectedPlan.price.replace('₹', '')) * 3).toString()}
              </span>
            </div>

            <div className="summary-item">
              <span className="item-name">IGST</span>
              <span className="item-price" style={{fontSize:"16px",fontWeight:"550"}}>₹18</span>
            </div>

            <div className="summary-item discount">
              <span className="item-name">Special Discount (Free Trial)</span>
              <span className="item-price" style={{fontSize:"16px",fontWeight:"550"}}>- ₹{(parseInt(selectedPlan.price.replace('₹', '')) * 3).toString()}</span>
            </div>

            <div className="summary-total">
              <span className="total-label">Total Amount</span>
              <span className="total-price" style={{fontSize:"16px",fontWeight:"550"}}>₹100 / month</span>
            </div>
          </div>
          <div className="future-charge">
              {selectedPlan.price} / month will be charged from the 4th month
          </div>

          {showOverlay && (
            <div className="overlay" onClick={handleOverlayClick}>
              <div className="overlay-content">
                <h2>Choose a plan</h2>
                
                {plans.map((plan, index) => (
                  <div key={index} className="plan-option">
                    <label className="radio-container">
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan.planName === plan.planName}
                        onChange={() => setSelectedPlan(plan)}
                      />
                      <span className="radio-checkmark"></span>
                      <div className="plan-details">
                        <div className="plan-header">
                          <span className="plan-name">{plan.planName}</span>
                          <span className="plan-price" ><span  style={{fontSize:"16px",fontWeight:"550"}}>{plan.price}</span> / month</span>
                        </div>
                        <div className="plan-features">{plan.features}</div>
                      </div>
                    </label>
                  </div>
                ))}
                
                <button 
                  type="button"
                  className="select-plan-btn"
                  onClick={() => handlePlanSelect(selectedPlan)}
                >
                  Select Plan
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="button-container-step-pack">
        <Link to='/business' style={{ textDecoration: "none" }}>
          <button type="button" className="back-button">
            <MdOutlineKeyboardBackspace size={24} className="arrow-icon-back" /> Back 
          </button>
          </Link>
          <button type="submit" className="next-button">
            Pay Now <IoIosArrowRoundForward size={28} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Package;