import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    country: 'India'
  });

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];

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
      
      <div className="progress-container">
        <div className="header">
          <h1 className="title">Add Shop</h1>
        </div>
        <div className='progress-steps'>
          <div className="step-item">
            <div className="step-circle active" onClick={() => {navigate('/store')}}>1</div>
          </div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="step-item">
            <div className="step-circle" onClick={() => {navigate('/business')}}>2</div>
          </div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="step-item">
            <div className="step-circle" onClick={() => {navigate('/package')}}>3</div>
          </div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="step-item">
            <div className="step-circle" onClick={() => {navigate('/payment')}}>4</div>
          </div>
        </div>

        <div className="progress-container-text">
          <span className="step-label">Store Details</span>
          <span className="step-label">Business Details</span>
          <span className="step-label">Package Selection</span>
          <span className="step-label">Payment</span>
        </div>
      </div>

      <div className='form-container'>
        <div className='form-wrapper'>
          <form onSubmit={handleSubmit}>
            <div className="form-group-store">
              <label className="form-label">
                Shop Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="shopName"
                placeholder="Enter shop name"
                value={formData.shopName}
                onChange={handleChange}
                className="form-input-store"
                required
              />
            </div>

            <div className="form-group-store">
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
                    className="form-input-store"
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
                    className="form-input-store"
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
                    className="form-input-store"
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
                      className="form-input-store-col"
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
                      className="form-input-store-col"
                      value={formData.pinCode}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="pinCode">Pin Code <span className="required">*</span></label>
                  </div>
                </div>

                <div className="form-field">
                  <select
                    id="state"
                    name="state"
                    className="form-input-store-select"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a state</option>
                    {indianStates.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </select>
                  <label htmlFor="state">State <span className="required">*</span></label>
                </div>

                <div className="form-field">
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Enter country"
                    className="form-input-store"
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
      </div>
    </div>
  );
}

export default Store;