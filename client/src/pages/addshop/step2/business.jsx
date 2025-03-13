import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FiUpload, FiX } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { Toaster, toast } from 'sonner';
import { databases, account, storage, ID, DATABASE_ID, STORAGE_BUCKET_ID, Query } from '../../../../../server/src/appwriteConfig';
import { encryptData, decryptData } from '../../../utils/encryption';
import './business.css';

const Business = () => {
  const [gstNumber, setGstNumber] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [isDocumentSubmitted, setIsDocumentSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = sessionStorage.getItem('businessData');
    if (savedData) {
      const decryptedData = decryptData(savedData);
      if (decryptedData) {
        setGstNumber(decryptedData.gstNumber || '');
        setInitialData(decryptedData);
        setIsDocumentSubmitted(true);
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
          '67c862750028167dd88b', 
          [Query.equal('userId', [userId])]
        );

        if (response.documents.length > 0) {
          const existingDocument = response.documents[0];
          setDocumentId(existingDocument.$id);

          if (existingDocument.fileId) {
            setIsDocumentSubmitted(true); 
          }
        }
      } catch (err) {
        console.error("Error fetching existing document:", err);
      }
    };

    fetchExistingDocument();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setHasChanges(true);
    }
  };

  const handleCancelFile = () => {
    setFile(null);
    setHasChanges(true);
  };

  const handleSubmittedCancelFile = () => {
    setIsDocumentSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDocumentSubmitted && !hasChanges) {
      navigate('/package');
      return;
    }

    setLoading(true);
    setError('');

    const user = await account.get();
    const userId = user.$id;

    if (!userId) {
      return;
    }

    try {
      let fileId = initialData?.fileId || null;
      let fileUrl = initialData?.fileUrl || null;

      if (file) {
        if (documentId && initialData?.fileId) {
          await storage.deleteFile(STORAGE_BUCKET_ID, initialData.fileId);
          console.log("Existing file deleted:", initialData.fileId);
        }

        const fileUploadResponse = await storage.createFile(
          STORAGE_BUCKET_ID,
          ID.unique(),
          file
        );
        fileId = fileUploadResponse.$id;
        console.log('File uploaded:', fileId);

        fileUrl = storage.getFileView(STORAGE_BUCKET_ID, fileId);
        console.log('File URL:', fileUrl);
      }

      const businessData = { gstNumber, fileId, fileUrl };

      if (documentId) {
        await databases.deleteDocument(
          DATABASE_ID,
          '67c862750028167dd88b',
          documentId
        );
        console.log("Existing document deleted:", documentId);
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        '67c862750028167dd88b', 
        ID.unique(),
        {
          userId,
          gstNumber: gstNumber,
          fileId: fileId,
          fileUrl: fileUrl
        }
      );

      console.log('Business details saved:', response);
      sessionStorage.setItem('businessData', encryptData(businessData));
      setInitialData(businessData);
      setHasChanges(false);
      setIsDocumentSubmitted(true); 
      navigate('/package');
    } catch (err) {
      toast.error('Error');
      setError('Failed to save business details.');
      console.error('Error:', err);
    } finally {
      toast.success('Saved');
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <Toaster position="bottom-center" />

      <div className="header">
        <h1 className="title">Business Details</h1>
        <div className="spacer"></div>
      </div>

      <div className="progress-container">
        <div className="step-item"><div className="step-circle active">1</div></div>
        <div className="dot active"></div><div className="dot active"></div><div className="dot active"></div>
        <div className="step-item"><div className="step-circle active">2</div></div>
        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        <div className="step-item"><div className="step-circle">3</div></div>
        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        <div className="step-item"><div className="step-circle">4</div></div>
      </div>
      <div className="progress-container-text">
        <span className="step-label" style={{ marginLeft: "5px" }}>Store Details</span>
        <span className="step-label" style={{ marginLeft: "5px" }}>Business Details</span>
        <span className="step-label" style={{ marginLeft: "2px" }}>Package Selection</span>
        <span className="step-label" style={{ marginTop: "-9px" }}>Payment</span>
      </div>


      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="gstNumber">
              GST Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="gstNumber"
              placeholder="Enter your GST number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="drugLicense">
              Drug License Upload <span className="required">*</span>
            </label>
            <div className="upload-container">
              {isDocumentSubmitted && !file ? (
                <div className="submitted-document">
                  <div className="submitted-message">
                    Document Submitted<pre> </pre><IoCheckmarkCircleSharp style={{color:"#2196f3"}} size={24}/>
                  </div>
                   <div className="file-submitted-actions">
                    <label htmlFor="replace-file" className="replace-file-btn">Choose another file</label>
                    <input
                      type="file"
                      id="replace-file"
                      onChange={handleFileChange}
                      className="hidden-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <button 
                      type="button" 
                      className="cancel-file-btn"
                      onClick={handleSubmittedCancelFile}
                    >
                      <AiTwotoneDelete size={17} />
                    </button>
                  </div>
                </div>
              ) : !file ? (
                <>
                  <input
                    type="file"
                    id="drugLicense"
                    onChange={handleFileChange}
                    className="file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <div className="upload-content">
                    <div className="file-icon">
                      <FiUpload size={24} color="#2196f3" />
                    </div>
                    <div className="upload-text">
                      <span className="choose-file">Choose file</span> to upload
                    </div>
                    <div className="upload-info">
                      Supported formats: PDF, JPG, PNG (Max 10 MB)
                    </div>
                  </div>
                </>
              ) : (
                <div className="file-preview">
                  <div className="file-preview-info">
                    <div className="file-preview-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#90CAF9" />
                      </svg>
                    </div>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
                    </div>
                  </div>
                  <div className="file-actions">
                    <label htmlFor="replace-file" className="replace-file-btn">Choose another file</label>
                    <input
                      type="file"
                      id="replace-file"
                      onChange={handleFileChange}
                      className="hidden-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <button 
                      type="button" 
                      className="cancel-file-btn"
                      onClick={handleCancelFile}
                    >
                      <AiTwotoneDelete size={17} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="button-container-step">
          <Link to='/store' style={{ textDecoration: "none" }}>
            <button type="button" className="back-button">
              <MdOutlineKeyboardBackspace size={24} className="arrow-icon-back" /> Back 
            </button>
          </Link>
          <button type="submit" className="next-button">
            {loading ? 'Saving...' : 'Next'} <IoIosArrowRoundForward size={28} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Business;