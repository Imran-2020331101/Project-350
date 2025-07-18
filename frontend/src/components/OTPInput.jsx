import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const OTPInput = ({ 
  length = 6, 
  onComplete, 
  value = '', 
  onChange, 
  disabled = false,
  error = false,
  autoFocus = false 
}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      while (otpArray.length < length) {
        otpArray.push('');
      }
      setOtp(otpArray);
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, val) => {
    if (disabled) return;
    
    // Only allow digits
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Call onChange if provided
    if (onChange) {
      onChange(newOtp.join(''));
    }

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onComplete when all digits are filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(''));
        }
      }
    }
    // Handle left/right arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        const newOtp = Array(length).fill('');
        for (let i = 0; i < digits.length; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(''));
        }
        if (digits.length === length && onComplete) {
          onComplete(newOtp.join(''));
        }
        // Focus the last filled input or next empty input
        const focusIndex = Math.min(digits.length, length - 1);
        inputRefs.current[focusIndex].focus();
      });
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, length);
    
    const newOtp = Array(length).fill('');
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    
    setOtp(newOtp);
    if (onChange) {
      onChange(newOtp.join(''));
    }
    
    if (digits.length === length && onComplete) {
      onComplete(newOtp.join(''));
    }
    
    // Focus the last filled input or next empty input
    const focusIndex = Math.min(digits.length, length - 1);
    inputRefs.current[focusIndex].focus();
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-lg
            focus:outline-none focus:ring-2 transition-all duration-200
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white'
            }
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed opacity-60' 
              : 'hover:border-gray-400'
            }
            ${digit 
              ? (error ? 'text-red-600' : 'text-gray-900') 
              : 'text-gray-400'
            }
          `}
          maxLength={1}
          autoComplete="off"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      ))}
    </div>
  );
};

OTPInput.propTypes = {
  length: PropTypes.number,
  onComplete: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default OTPInput;
