import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api, handleApiError, categories, convertImageToBase64 } from '../utils/api';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    category: '',
    subtype: '',
    title: '',
    description: '',
    price: '',
    size: '',
    rentType: [],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    contact: '',
    images: [],
    ownerProof: null,
    propertyProof: null
  });  
  
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ownerProofPreview, setOwnerProofPreview] = useState(null);
  const [propertyProofPreview, setPropertyProofPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Ultra-Premium SVG Icons Component
  const Icon = ({ name, size = 20, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      uploadCloud: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <path d="m12 12-3 3h2v3h2v-3h2l-3-3z"/>
        </svg>
      ),
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>
      ),
      imageGallery: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          <rect width="12" height="12" x="9" y="9" rx="1" ry="1" opacity="0.6"/>
        </svg>
      ),
      documentCheck: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <polyline points="9,15 11,17 15,13"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      shield: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      trendingUp: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
          <polyline points="16,7 22,7 22,13"/>
        </svg>
      ),
      zap: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
        </svg>
      ),
      layers: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polygon points="12,2 2,7 12,12 22,7 12,2"/>
          <polyline points="2,17 12,22 22,17"/>
          <polyline points="2,12 12,17 22,12"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  // Utility to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleOwnerProofChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setError('Owner proof must be an image or PDF');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Owner proof file is too large (max 5MB)');
      return;
    }
    
    const base64 = await convertFileToBase64(file);
    setFormData({ ...formData, ownerProof: base64 });
    setOwnerProofPreview({ name: file.name, src: base64, type: file.type });
    setError('');
  };

  const handlePropertyProofChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setError('Property proof must be an image or PDF');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Property proof file is too large (max 5MB)');
      return;
    }
    
    const base64 = await convertFileToBase64(file);
    setFormData({ ...formData, propertyProof: base64 });
    setPropertyProofPreview({ name: file.name, src: base64, type: file.type });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else if (name === 'rentType') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({
        ...formData,
        rentType: selectedOptions
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subtype: '',
        rentType: categories[value]?.rentTypes || []
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (formData.images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }
    
    setUploadingImages(true);
    setUploadProgress(0);
    
    try {
      const newImages = [];
      const newPreviews = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          setUploadingImages(false);
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image.`);
          setUploadingImages(false);
          return;
        }
        
        const base64 = await convertImageToBase64(file);
        newImages.push(base64);
        newPreviews.push({
          id: Date.now() + Math.random(),
          src: base64,
          name: file.name
        });
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setError('');
    } catch (error) {
      setError('Error processing images. Please try again.');
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      images: newImages
    });
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.size.trim()) {
      setError('Size is required');
      return false;
    }
    if (formData.rentType.length === 0) {
      setError('Please select at least one rent type');
      return false;
    }
    if (!formData.address.city.trim() || !formData.address.state.trim() || !formData.address.pincode.trim()) {
      setError('City, state, and pincode are required');
      return false;
    }
    if (!/^\d{6}$/.test(formData.address.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!formData.contact.trim()) {
      setError('Contact information is required');
      return false;
    }
    if (formData.images.length === 0) {
      setError('Please upload at least one property image');
      return false;
    }
    if (!formData.ownerProof) {
      setError('Please upload owner proof (Aadhar or PAN card)');
      return false;
    }
    if (!formData.propertyProof) {
      setError('Please upload property proof (Electricity Bill, Water Bill, Tax Receipt, or Lease Agreement)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.properties.create(formData);
      setSuccess('Property added successfully! Redirecting to manage properties...');
      
      setTimeout(() => {
        navigate('/manage-properties');
      }, 2000);
    } catch (error) {
      console.error('Error adding property:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getFormProgress = () => {
    let progress = 0;
    const fields = [
      formData.category,
      formData.title,
      formData.description,
      formData.price,
      formData.size,
      formData.rentType.length > 0,
      formData.address.city,
      formData.address.state,
      formData.address.pincode,
      formData.contact,
      formData.images.length > 0,
      formData.ownerProof,
      formData.propertyProof
    ];
    
    const completedFields = fields.filter(field => field).length;
    progress = (completedFields / fields.length) * 100;
    return Math.round(progress);
  };

  return (
    <div style={{ 
      background: `
        conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(36, 0, 255) 0deg, rgb(0, 135, 255) 67.5deg, rgb(108, 39, 157) 198.75deg, rgb(24, 38, 163) 251.25deg, rgb(54, 103, 196) 301.88deg, rgb(105, 30, 255) 360deg),
        radial-gradient(circle at 25% 25%, rgba(255, 154, 158, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(101, 163, 13, 0.1) 100%)
      `,
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* PREMIUM GRID OVERLAY EFFECT */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        animation: 'gridPulse 4s ease-in-out infinite alternate',
        zIndex: 1
      }} />

      {/* FLOATING GRADIENT ORBS */}
      <div style={{
        position: 'fixed',
        top: '15%',
        left: '85%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 1
      }} />

      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.1) 50%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(35px)',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 1
      }} />

      {/* ANIMATED PARTICLES */}
      <div style={{
        position: 'fixed',
        top: '20%',
        right: '20%',
        width: '8px',
        height: '8px',
        background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
        borderRadius: '50%',
        animation: 'particle 10s linear infinite',
        zIndex: 1,
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
      }} />

      <div style={{
        position: 'fixed',
        top: '60%',
        left: '15%',
        width: '6px',
        height: '6px',
        background: 'linear-gradient(45deg, #10b981, #059669)',
        borderRadius: '50%',
        animation: 'particle 12s linear infinite reverse',
        zIndex: 1,
        boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
      }} />

      <style>
        {`
          @keyframes gridPulse {
            0%, 100% { 
              opacity: 0.5;
              transform: scale(1);
            }
            50% { 
              opacity: 0.8;
              transform: scale(1.02);
            }
          }
          
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            25% { 
              transform: translateY(-20px) translateX(10px) rotate(2deg);
            }
            50% { 
              transform: translateY(-35px) translateX(-5px) rotate(-1deg);
            }
            75% { 
              transform: translateY(-15px) translateX(-10px) rotate(1deg);
            }
          }
          
          @keyframes particle {
            0% { 
              transform: translateY(0px) translateX(0px) scale(1);
              opacity: 0.8;
            }
            25% { 
              transform: translateY(-100px) translateX(50px) scale(1.2);
              opacity: 1;
            }
            50% { 
              transform: translateY(-180px) translateX(-20px) scale(0.8);
              opacity: 0.6;
            }
            75% { 
              transform: translateY(-120px) translateX(-80px) scale(1.1);
              opacity: 0.9;
            }
            100% { 
              transform: translateY(0px) translateX(0px) scale(1);
              opacity: 0.8;
            }
          }
          
          .premium-glass {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 
              0 25px 45px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .ultra-card {
            background: linear-gradient(145deg, 
              rgba(255, 255, 255, 0.25) 0%, 
              rgba(255, 255, 255, 0.1) 50%, 
              rgba(255, 255, 255, 0.05) 100%);
            backdrop-filter: blur(60px);
            border: 2px solid transparent;
            border-image: linear-gradient(145deg, 
              rgba(255, 255, 255, 0.3), 
              rgba(255, 255, 255, 0.1), 
              rgba(255, 255, 255, 0.05)) 1;
            box-shadow: 
              0 32px 64px rgba(139, 92, 246, 0.15),
              0 16px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .ultra-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
              0 40px 80px rgba(139, 92, 246, 0.25),
              0 20px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          
          .premium-input {
            background: linear-gradient(145deg, 
              rgba(255, 255, 255, 0.9) 0%, 
              rgba(255, 255, 255, 0.7) 100%);
            border: 2px solid rgba(139, 92, 246, 0.2);
            border-radius: 20px;
            padding: 18px 24px;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 
              inset 0 2px 4px rgba(139, 92, 246, 0.1),
              0 4px 8px rgba(0, 0, 0, 0.05);
          }
          
          .premium-input:focus {
            outline: none;
            border-color: rgba(139, 92, 246, 0.6);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 
              0 0 0 4px rgba(139, 92, 246, 0.15),
              inset 0 2px 4px rgba(139, 92, 246, 0.1),
              0 8px 16px rgba(139, 92, 246, 0.1);
            transform: translateY(-2px);
          }
          
          .gradient-button {
            background: linear-gradient(135deg, 
              #8b5cf6 0%, 
              #a855f7 25%, 
              #c084fc 50%, 
              #a855f7 75%, 
              #8b5cf6 100%);
            background-size: 300% 300%;
            border: none;
            color: white;
            font-weight: 700;
            font-size: 18px;
            padding: 20px 48px;
            border-radius: 50px;
            box-shadow: 
              0 16px 32px rgba(139, 92, 246, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: gradientShift 3s ease infinite;
            position: relative;
            overflow: hidden;
          }
          
          .gradient-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.3), 
              transparent);
            transition: left 0.5s;
          }
          
          .gradient-button:hover::before {
            left: 100%;
          }
          
          .gradient-button:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 
              0 24px 48px rgba(139, 92, 246, 0.5),
              0 12px 24px rgba(0, 0, 0, 0.15);
            background-position: 100% 0%;
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .upload-zone {
            background: linear-gradient(145deg, 
              rgba(139, 92, 246, 0.05) 0%, 
              rgba(168, 85, 247, 0.03) 50%, 
              rgba(139, 92, 246, 0.05) 100%);
            border: 3px dashed rgba(139, 92, 246, 0.3);
            border-radius: 24px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .upload-zone::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, 
              rgba(139, 92, 246, 0.1) 0%, 
              transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .upload-zone:hover::before {
            opacity: 1;
          }
          
          .upload-zone:hover {
            border-color: rgba(139, 92, 246, 0.6);
            background: rgba(139, 92, 246, 0.08);
            transform: translateY(-4px);
            box-shadow: 0 16px 32px rgba(139, 92, 246, 0.2);
          }
          
          .section-header {
            background: linear-gradient(135deg, 
              rgba(139, 92, 246, 0.1) 0%, 
              rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 20px;
            padding: 20px 28px;
            margin-bottom: 32px;
            backdrop-filter: blur(20px);
            position: relative;
            overflow: hidden;
          }
          
          .section-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(139, 92, 246, 0.6), 
              transparent);
          }
          
          .progress-bar-wrapper {
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50px;
            padding: 6px;
            backdrop-filter: blur(10px);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .progress-bar-fill {
            background: linear-gradient(90deg, 
              #8b5cf6 0%, 
              #a855f7 50%, 
              #c084fc 100%);
            border-radius: 50px;
            height: 12px;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            
            {/* ULTRA-PREMIUM HEADER CARD */}
            <Card className="mb-5 ultra-card" style={{ borderRadius: '32px', padding: '8px' }}>
              <Card.Body className="p-5">
                <div className="d-flex align-items-center mb-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
                    borderRadius: '24px',
                    padding: '20px',
                    color: 'white',
                    marginRight: '24px',
                    boxShadow: '0 16px 32px rgba(139, 92, 246, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                      animation: 'rotate 4s linear infinite'
                    }} />
                    <Icon name="home" size={32} style={{ position: 'relative', zIndex: 1 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <h1 style={{ 
                        fontWeight: '800', 
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                      }}>
                        Add New Property
                      </h1>
                      <Icon name="sparkles" size={28} style={{ color: '#f59e0b', animation: 'sparkle 2s ease-in-out infinite' }} />
                    </div>
                    <p style={{ 
                      fontSize: '1.1rem', 
                      color: '#64748b', 
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      List your premium property and connect with thousands of verified tenants
                    </p>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Icon name="trendingUp" size={20} style={{ color: '#8b5cf6' }} />
                    <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '600' }}>Progress</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Icon name="zap" size={18} style={{ color: '#f59e0b' }} />
                    <span style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {getFormProgress()}% Complete
                    </span>
                  </div>
                </div>
                
                <div className="progress-bar-wrapper">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${getFormProgress()}%` }}
                  />
                </div>
              </Card.Body>
            </Card>

            {/* MAIN ULTRA-PREMIUM FORM CARD */}
            <Card className="ultra-card" style={{ borderRadius: '32px', padding: '8px' }}>
              <Card.Body className="p-5">
                
                {/* ALERTS */}
                {success && (
                  <Alert 
                    variant="success" 
                    className="mb-4" 
                    style={{ 
                      borderRadius: '20px',
                      border: 'none',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                      color: '#16a34a',
                      padding: '20px 28px',
                      fontWeight: '600',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
                      fontSize: '1rem'
                    }}
                  >
                    <Icon name="check" size={20} className="me-3" />
                    {success}
                  </Alert>
                )}
                
                {error && (
                  <Alert 
                    variant="danger" 
                    className="mb-4" 
                    style={{ 
                      borderRadius: '20px',
                      border: 'none',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                      color: '#dc2626',
                      padding: '20px 28px',
                      fontWeight: '600',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
                      fontSize: '1rem'
                    }}
                  >
                    <Icon name="x" size={20} className="me-3" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  
                  {/* PROPERTY DETAILS SECTION */}
                  <div className="section-header">
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="layers" size={24} style={{ color: '#8b5cf6' }} />
                      <h4 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.3rem'
                      }}>
                        Property Details
                      </h4>
                    </div>
                  </div>
                  
                  <Row className="g-4 mb-5">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="home" size={16} />
                          Category *
                        </Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="premium-input"
                        >
                          <option value="">Select Category</option>
                          {Object.keys(categories).map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="layers" size={16} />
                          Subtype {formData.category !== 'Event' && '*'}
                        </Form.Label>
                        <Form.Select
                          name="subtype"
                          value={formData.subtype}
                          onChange={handleInputChange}
                          disabled={!formData.category}
                          required={formData.category !== 'Event'}
                          className="premium-input"
                        >
                          <option value="">Select Subtype</option>
                          {formData.category && categories[formData.category]?.subtypes?.map(subtype => (
                            <option key={subtype} value={subtype}>
                              {subtype}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="sparkles" size={16} />
                          Property Title *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter an attractive, descriptive property title"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="documentCheck" size={16} />
                          Property Description *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your property in detail - amenities, location benefits, unique features, nearby facilities..."
                          required
                          className="premium-input"
                          style={{ resize: 'vertical', minHeight: '120px' }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="trendingUp" size={16} />
                          Price (₹) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Enter monthly/daily rent amount"
                          min="0"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="layers" size={16} />
                          Size/Capacity *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleInputChange}
                          placeholder="e.g., 1000 sq ft, 2 BHK, 50 people capacity"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* RENT TYPE SECTION */}
                  <div className="section-header">
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="zap" size={24} style={{ color: '#f59e0b' }} />
                      <h4 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.3rem'
                      }}>
                        Rental Options *
                      </h4>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="d-flex flex-wrap gap-4">
                      {formData.category && categories[formData.category]?.rentTypes?.map(type => (
                        <div 
                          key={type}
                          style={{
                            background: formData.rentType.includes(type) 
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1))'
                              : 'rgba(255, 255, 255, 0.7)',
                            border: formData.rentType.includes(type) 
                              ? '2px solid rgba(139, 92, 246, 0.5)'
                              : '2px solid rgba(156, 163, 175, 0.3)',
                            borderRadius: '16px',
                            padding: '16px 24px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            userSelect: 'none'
                          }}
                          onClick={() => {
                            const value = type;
                            const newRentTypes = formData.rentType.includes(value)
                              ? formData.rentType.filter(t => t !== value)
                              : [...formData.rentType, value];
                            setFormData({
                              ...formData,
                              rentType: newRentTypes
                            });
                          }}
                        >
                          <Form.Check
                            type="checkbox"
                            id={`rentType-${type}`}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            value={type}
                            checked={formData.rentType.includes(type)}
                            onChange={() => {}} // Controlled by div onClick
                            style={{ 
                              fontSize: '1rem', 
                              fontWeight: '600',
                              pointerEvents: 'none' // Prevent double-click issues
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ADDRESS SECTION */}
                  <div className="section-header">
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="mapPin" size={24} style={{ color: '#10b981' }} />
                      <h4 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.3rem'
                      }}>
                        Location Information
                      </h4>
                    </div>
                  </div>

                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px'
                        }}>
                          Street Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          placeholder="Enter complete street address with landmarks"
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px'
                        }}>
                          City *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          placeholder="Enter city name"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px'
                        }}>
                          State *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          placeholder="Enter state name"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px'
                        }}>
                          Pincode *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.pincode"
                          value={formData.address.pincode}
                          onChange={handleInputChange}
                          placeholder="6-digit pincode"
                          maxLength="6"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* CONTACT SECTION */}
                  <div className="section-header">
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="phone" size={24} style={{ color: '#3b82f6' }} />
                      <h4 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.3rem'
                      }}>
                        Contact Information
                      </h4>
                    </div>
                  </div>

                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '12px'
                        }}>
                          Contact Details *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          placeholder="Enter phone number or email address"
                          required
                          className="premium-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* ULTRA-PREMIUM IMAGES SECTION */}
                  <div className="section-header">
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="imageGallery" size={24} style={{ color: '#ec4899' }} />
                      <h4 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.3rem'
                      }}>
                        Property Gallery *
                      </h4>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="upload-zone" style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div className="mb-4">
                        <Icon 
                          name="uploadCloud" 
                          size={80} 
                          style={{ 
                            color: '#8b5cf6',
                            filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
                          }} 
                        />
                      </div>
                      
                      <h5 style={{ 
                        fontWeight: '800', 
                        color: '#1e293b', 
                        marginBottom: '16px',
                        fontSize: '1.5rem'
                      }}>
                        Upload Premium Property Images
                      </h5>
                      
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '1.1rem', 
                        marginBottom: '32px',
                        lineHeight: '1.6'
                      }}>
                        Upload up to 5 high-quality images (Max 5MB each)<br/>
                        <span style={{ fontSize: '1rem', color: '#8b5cf6', fontWeight: '600' }}>
                          First image will be used as cover photo
                        </span>
                      </p>
                      
                      <Form.Control
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={uploadingImages}
                        className="premium-input"
                        style={{ 
                          fontSize: '1rem',
                          padding: '20px',
                          cursor: 'pointer'
                        }}
                      />
                      
                      {uploadingImages && (
                        <div className="mt-4">
                          <div className="progress-bar-wrapper mb-3">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <Spinner size="sm" style={{ color: '#8b5cf6' }} />
                            <span style={{ color: '#64748b', fontWeight: '600' }}>
                              Processing images... {Math.round(uploadProgress)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {imagePreviews.length > 0 && (
                      <div className="mt-4">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <h6 style={{ 
                            fontWeight: '700', 
                            color: '#1e293b', 
                            fontSize: '1.2rem',
                            margin: 0
                          }}>
                            Uploaded Images
                          </h6>
                          <Badge 
                            style={{
                              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                              color: 'white',
                              padding: '12px 20px',
                              borderRadius: '50px',
                              fontSize: '0.9rem',
                              fontWeight: '700'
                            }}
                          >
                            {imagePreviews.length}/5 images
                          </Badge>
                        </div>
                        
                        <Row className="g-4">
                          {imagePreviews.map((preview, index) => (
                            <Col key={preview.id} md={6} lg={4}>
                              <div style={{
                                position: 'relative',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                                border: index === 0 ? '3px solid #f59e0b' : '2px solid rgba(139, 92, 246, 0.2)'
                              }}>
                                {index === 0 && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '50px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    zIndex: 2,
                                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)'
                                  }}>
                                    Cover Photo
                                  </div>
                                )}
                                
                                <img 
                                  src={preview.src} 
                                  alt={`Property Preview ${index + 1}`} 
                                  style={{ 
                                    width: '100%',
                                    height: '200px', 
                                    objectFit: 'cover'
                                  }}
                                />
                                
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                                    zIndex: 2
                                  }}
                                >
                                  <Icon name="x" size={16} />
                                </Button>
                                
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                  padding: '20px 16px 16px',
                                  color: 'white'
                                }}>
                                  <p style={{ 
                                    margin: 0, 
                                    fontSize: '0.9rem', 
                                    fontWeight: '600',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                  }}>
                                    {preview.name.substring(0, 20)}...
                                  </p>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* ULTRA-PREMIUM VERIFICATION DOCUMENTS SECTION */}
                  <div className="section-header">
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="shield" size={24} style={{ color: '#059669' }} />
                      <h4 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.3rem'
                      }}>
                        Verification Documents
                      </h4>
                    </div>
                  </div>

                  <Row className="g-4 mb-5">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="documentCheck" size={18} />
                          Owner Proof * (Aadhar/PAN Card)
                        </Form.Label>
                        
                        <div className="upload-zone" style={{ padding: '40px 32px', textAlign: 'center' }}>
                          <Icon name="documentCheck" size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
                          <p style={{ 
                            color: '#64748b', 
                            fontSize: '1rem', 
                            marginBottom: '20px',
                            fontWeight: '500'
                          }}>
                            Upload PDF or Image (Max 5MB)
                          </p>
                          <Form.Control
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleOwnerProofChange}
                            className="premium-input"
                            style={{ fontSize: '0.9rem' }}
                          />
                        </div>
                        
                        {ownerProofPreview && (
                          <div className="mt-3" style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                            borderRadius: '16px',
                            border: '2px solid rgba(34, 197, 94, 0.3)',
                            padding: '20px'
                          }}>
                            <div className="d-flex align-items-center gap-3">
                              <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                borderRadius: '50%',
                                padding: '12px',
                                color: 'white'
                              }}>
                                <Icon name="check" size={20} />
                              </div>
                              <div>
                                <p style={{ 
                                  margin: 0, 
                                  fontSize: '1rem', 
                                  color: '#16a34a',
                                  fontWeight: '700'
                                }}>
                                  {ownerProofPreview.name}
                                </p>
                                <p style={{ 
                                  margin: 0, 
                                  fontSize: '0.9rem', 
                                  color: '#059669',
                                  fontWeight: '500'
                                }}>
                                  Successfully uploaded
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: '700', 
                          color: '#374151', 
                          fontSize: '1rem',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Icon name="documentCheck" size={18} />
                          Property Proof * (Bill/Document)
                        </Form.Label>
                        
                        <div className="upload-zone" style={{ padding: '40px 32px', textAlign: 'center' }}>
                          <Icon name="documentCheck" size={48} style={{ color: '#8b5cf6', marginBottom: '16px' }} />
                          <p style={{ 
                            color: '#64748b', 
                            fontSize: '1rem', 
                            marginBottom: '20px',
                            fontWeight: '500'
                          }}>
                            Electricity Bill, Tax Receipt, etc. (Max 5MB)
                          </p>
                          <Form.Control
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handlePropertyProofChange}
                            className="premium-input"
                            style={{ fontSize: '0.9rem' }}
                          />
                        </div>
                        
                        {propertyProofPreview && (
                          <div className="mt-3" style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                            borderRadius: '16px',
                            border: '2px solid rgba(34, 197, 94, 0.3)',
                            padding: '20px'
                          }}>
                            <div className="d-flex align-items-center gap-3">
                              <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                borderRadius: '50%',
                                padding: '12px',
                                color: 'white'
                              }}>
                                <Icon name="check" size={20} />
                              </div>
                              <div>
                                <p style={{ 
                                  margin: 0, 
                                  fontSize: '1rem', 
                                  color: '#16a34a',
                                  fontWeight: '700'
                                }}>
                                  {propertyProofPreview.name}
                                </p>
                                <p style={{ 
                                  margin: 0, 
                                  fontSize: '0.9rem', 
                                  color: '#059669',
                                  fontWeight: '500'
                                }}>
                                  Successfully uploaded
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* ULTRA-PREMIUM SUBMIT SECTION */}
                  <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingImages}
                      className="gradient-button"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-3" />
                          Creating Your Listing...
                        </>
                      ) : (
                        <>
                          <Icon name="uploadCloud" size={24} className="me-3" />
                          Add Property to Platform
                        </>
                      )}
                    </Button>
                    
                    <p style={{ 
                      marginTop: '24px', 
                      color: '#64748b', 
                      fontSize: '1rem',
                      fontWeight: '500',
                      lineHeight: '1.6'
                    }}>
                      By submitting, you agree to our{' '}
                      <span style={{ color: '#8b5cf6', fontWeight: '600', textDecoration: 'underline' }}>
                        terms and conditions
                      </span>
                      <br/>
                      <Icon name="shield" size={16} className="me-2" style={{ color: '#10b981' }} />
                      Your information is secure and encrypted
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default AddProperty;
