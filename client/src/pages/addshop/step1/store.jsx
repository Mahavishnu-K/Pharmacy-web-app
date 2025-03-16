import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { toast } from 'react-hot-toast';
import { databases, DATABASE_ID, ID, account, Query } from './../../../../appwriteConfig';
import { encryptData, decryptData } from '../../../utils/encryption';
import './store.css';

const Store = () => {
  const [initialData, setInitialData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [documentId, setDocumentId] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shopName: '',
    shopNumber: '',
    streetName: '',
    locality: '',
    city: '',
    pinCode: '',
    state: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setHasChanges(true);
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("shopData");
    if (storedData) {
      const decryptedData = decryptData(storedData);
      if (decryptedData) {
        setFormData(decryptedData);
        setInitialData(decryptedData);
      }
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
          '67c86263003c960b56ed', 
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges && initialData) {
      navigate('/business');
      return;
    }

    try {
      const user = await account.get();
      const userId = user.$id;

      if (!userId) {
        toast.error('User not logged in');
        return;
      }

      const shopData = {
        userId,
        shopName: formData.shopName,
        shopNumber: formData.shopNumber,
        streetName: formData.streetName,
        locality: formData.locality,
        city: formData.city,
        pinCode: formData.pinCode,
        state: formData.state,
        country: formData.country,
      };

      if (documentId) {
        await databases.deleteDocument(
          DATABASE_ID,
          '67c86263003c960b56ed',
          documentId
        );
        console.log("Existing document deleted:", documentId);
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        '67c86263003c960b56ed', 
        ID.unique(),
        shopData
      );

      console.log("Shop data stored:", response);
      sessionStorage.setItem("shopData", encryptData(shopData));
      setInitialData(shopData);
      setHasChanges(false);
      setDocumentId(response.$id);
      
      toast.success('Saved successfully');
      
      setTimeout(() => {
        navigate('/business');
      }, 3000);
      
    } catch (err) {
      console.error("Error storing shop data:", err);
      toast.error('Failed to save');
    }
  };
  
  return (
    <div className="container">

      <div className="header">
        <div className="back-button-signup" onClick={() => navigate('/')}>
          <MdOutlineKeyboardBackspace size={24} />
        </div>
        <h1 className="title">Add Shop</h1>
        <div className="spacer"></div>
      </div>

      <div className="progress-container">
        <div className="step-item">
          <div className="step-circle active">1</div>
        </div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="step-item">
          <div className="step-circle">2</div>
        </div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="step-item">
          <div className="step-circle">3</div>
        </div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="step-item">
          <div className="step-circle">4</div>
        </div>
      </div>

      <div className="progress-container-text">
        <span className="step-label" style={{ marginLeft: "5px" }}>Store Details</span>
        <span className="step-label" style={{ marginLeft: "5px" }}>Business Details</span>
        <span className="step-label" style={{ marginLeft: "2px" }}>Package Selection</span>
        <span className="step-label" style={{ marginTop: "-9px" }}>Payment</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Shop Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="shopName"
            placeholder="Enter shop name"
            value={formData.shopName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Address <span className="required">*</span>
          </label>

          <div className="address-container">
            <div className="form-field">
              <input
                type="text"
                id="shopNumber"
                name="shopNumber"
                placeholder="Enter shop number"
                value={formData.shopNumber}
                onChange={handleChange}
                required
              />
              <label htmlFor="shopNumber">Shop Number <span className="required">*</span></label>
            </div>

            <div className="form-field">
              <input
                type="text"
                id="streetName"
                name="streetName"
                placeholder="Enter street name"
                value={formData.streetName}
                onChange={handleChange}
                required
              />
              <label htmlFor="streetName">Street Name <span className="required">*</span></label>
            </div>

            <div className="form-field">
              <input
                type="text"
                id="locality"
                name="locality"
                placeholder="Enter locality"
                value={formData.locality}
                onChange={handleChange}
              />
              <label htmlFor="locality">Locality (Optional)</label>
            </div>

            <div className="two-column">
              <div className="form-field">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="city">City <span className="required">*</span></label>
              </div>

              <div className="form-field">
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  placeholder="Enter pin code"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="pinCode">Pin Code <span className="required">*</span></label>
              </div>
            </div>

            <div className="form-field">
              <input
                type="text"
                id="state"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <label htmlFor="state">State <span className="required">*</span></label>
            </div>

            <div className="form-field">
              <input
                type="text"
                id="country"
                name="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <label htmlFor="country">Country <span className="required">*</span></label>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="next-button">
            Next <IoIosArrowRoundForward size={28} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Store;