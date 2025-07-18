import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPInput from './OTPInput';
import axios from '../config/axiosConfig';

const EmailVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state or localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
    
    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('pendingVerificationEmail', emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // If no email found, redirect to registration
      navigate('/register');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Countdown timer for resend button
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    await verifyOTP(otpValue);
  };

  const handleOTPChange = (otpValue) => {
    setOtp(otpValue);
    setError(''); // Clear error when user starts typing
  };

  const verifyOTP = async (otpValue) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/verify-email', {
        email,
        otp: otpValue
      });

      if (response.data.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        localStorage.removeItem('pendingVerificationEmail');
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! You can now login.',
              email 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      setOtp(''); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('/api/auth/resend-verification-otp', {
        email
      });

      if (response.data.success) {
        setSuccess('New verification code sent to your email!');
        setCountdown(60); // 60 seconds cooldown
        setOtp(''); // Clear current OTP
      }
    } catch (error) {
      console.error('Resend error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend verification code.';
      setError(errorMessage);
      
      // If there's a cooldown, extract the wait time
      if (error.response?.data?.cooldown && error.response?.data?.waitTime) {
        setCountdown(error.response.data.waitTime);
      }
    } finally {
      setResending(false);
    }
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/register');
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-blue-600">
            {maskEmail(email)}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              Enter verification code
            </label>
            <OTPInput
              length={6}
              value={otp}
              onChange={handleOTPChange}
              onComplete={handleOTPComplete}
              disabled={loading || !!success}
              error={!!error}
              autoFocus={true}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Manual Verify Button (if needed) */}
          {otp.length === 6 && !loading && !success && (
            <button
              onClick={() => verifyOTP(otp)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Email
            </button>
          )}

          {/* Resend Code */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resending || countdown > 0 || !!success}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                'Sending...'
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend verification code'
              )}
            </button>
          </div>

          {/* Change Email */}
          <div className="text-center">
            <button
              onClick={handleChangeEmail}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Wrong email? Change it
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            The verification code will expire in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
