const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_EMAIL, // Your Gmail address
          pass: process.env.SMTP_APP_PASSWORD, // Your Gmail App Password
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP Configuration Error:", error);
        } else {
          console.log("✅ SMTP Server is ready to send emails");
        }
      });
    } catch (error) {
      console.error("Failed to initialize email transporter:", error);
    }
  }

  async sendOTPEmail(email, otp, purpose = "registration") {
    if (!this.transporter) {
      throw new Error("Email service not initialized");
    }

    const subjects = {
      registration: "Verify Your OnTheGo Account",
      password_reset: "Reset Your OnTheGo Password",
      email_verification: "Verify Your Email Address",
      login_verification: "Login Verification Code",
    };

    const templates = {
      registration: this.getRegistrationTemplate(otp),
      password_reset: this.getPasswordResetTemplate(otp),
      email_verification: this.getEmailVerificationTemplate(otp),
      login_verification: this.getLoginVerificationTemplate(otp),
    };

    const mailOptions = {
      from: {
        name: "OnTheGo Travel Assistant",
        address: process.env.SMTP_EMAIL,
      },
      to: email,
      subject: subjects[purpose] || "Verification Code",
      html: templates[purpose] || this.getDefaultTemplate(otp, purpose),
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully:", info.messageId);
      return {
        success: true,
        messageId: info.messageId,
        message: "OTP sent successfully",
      };
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to send OTP email",
      };
    }
  }

  getRegistrationTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 OnTheGo Travel Assistant</h1>
            <p>Welcome to Your Travel Journey!</p>
          </div>
          <div class="content">
            <h2>Verify Your Account</h2>
            <p>Thank you for joining OnTheGo! To complete your registration, please use the verification code below:</p>
            
            <div class="otp-box">
              <p>Your Verification Code:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>Enter this code in the verification form to activate your account and start planning amazing trips!</p>
            
            <h3>What's Next?</h3>
            <ul>
              <li>✈️ Plan AI-powered travel itineraries</li>
              <li>💰 Track your travel expenses</li>
              <li>🚨 Access emergency assistance</li>
              <li>👥 Join travel groups</li>
              <li>📝 Share your travel blogs</li>
            </ul>
            
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 OnTheGo Travel Assistant. All rights reserved.</p>
            <p>Making your travel dreams come true with AI-powered assistance!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; border: 2px dashed #ff6b6b; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 5px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>OnTheGo Travel Assistant</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Use the verification code below to proceed:</p>
            
            <div class="otp-box">
              <p>Your Reset Code:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            
            <p>For your security:</p>
            <ul>
              <li>This code can only be used once</li>
              <li>Don't share this code with anyone</li>
              <li>The code expires in 10 minutes</li>
            </ul>
          </div>
          <div class="footer">
            <p>&copy; 2024 OnTheGo Travel Assistant. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getEmailVerificationTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #26de81 0%, #20bf6b 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; border: 2px dashed #26de81; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #26de81; letter-spacing: 5px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Email Verification</h1>
            <p>OnTheGo Travel Assistant</p>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Please verify your email address by entering the code below:</p>
            
            <div class="otp-box">
              <p>Your Verification Code:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>This helps us ensure your account security and keep you updated about your travel plans.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 OnTheGo Travel Assistant. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getLoginVerificationTemplate(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Verification</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #3742fa 0%, #2f3542 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; border: 2px dashed #3742fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #3742fa; letter-spacing: 5px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Login Verification</h1>
            <p>OnTheGo Travel Assistant</p>
          </div>
          <div class="content">
            <h2>Secure Login Verification</h2>
            <p>We detected a login attempt on your account. Please enter the verification code below to continue:</p>
            
            <div class="otp-box">
              <p>Your Login Code:</p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>This extra step helps keep your travel plans and personal information secure.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 OnTheGo Travel Assistant. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getDefaultTemplate(otp, purpose) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>OnTheGo Travel Assistant</h1>
          </div>
          <div class="content">
            <h2>Verification Code</h2>
            <p>Your verification code for ${purpose}:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 OnTheGo Travel Assistant. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(email, name) {
    if (!this.transporter) {
      throw new Error("Email service not initialized");
    }

    const mailOptions = {
      from: {
        name: "OnTheGo Travel Assistant",
        address: process.env.SMTP_EMAIL,
      },
      to: email,
      subject: "Welcome to OnTheGo! Your Travel Journey Begins Now 🌍",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to OnTheGo</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .feature { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
            .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to OnTheGo!</h1>
              <p>Hello ${name}, your travel adventure starts here!</p>
            </div>
            <div class="content">
              <h2>🌟 You're All Set!</h2>
              <p>Thank you for verifying your email and joining our travel community. Here's what you can do now:</p>
              
              <div class="feature">
                <h3>✈️ AI-Powered Trip Planning</h3>
                <p>Create personalized travel itineraries with our intelligent planning system.</p>
              </div>
              
              <div class="feature">
                <h3>💰 Expense Tracking</h3>
                <p>Keep track of your travel expenses with detailed analytics and budgeting tools.</p>
              </div>
              
              <div class="feature">
                <h3>🚨 Emergency Assistance</h3>
                <p>Access emergency contacts and assistance wherever you travel.</p>
              </div>
              
              <div class="feature">
                <h3>👥 Travel Groups</h3>
                <p>Join like-minded travelers and explore the world together.</p>
              </div>
              
              <div class="feature">
                <h3>📝 Travel Blogging</h3>
                <p>Share your travel experiences and discover amazing stories from others.</p>
              </div>
              
              <p style="text-align: center;">
                <a href="http://localhost:5173" class="btn">Start Your Journey</a>
              </p>
              
              <p>Happy travels!<br>The OnTheGo Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 OnTheGo Travel Assistant. All rights reserved.</p>
              <p>Making your travel dreams come true with AI-powered assistance!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Welcome email sent successfully:", info.messageId);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new EmailService();
