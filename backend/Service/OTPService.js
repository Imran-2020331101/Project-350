const OTP = require("../models/otp");
const EmailService = require("./EmailService");

class OTPService {
  /**
   * Generate and send OTP to user's email
   * @param {string} email - User's email address
   * @param {string} purpose - Purpose of OTP (registration, password_reset, etc.)
   * @returns {Object} - Operation result
   */
  async generateAndSendOTP(email, purpose = "registration") {
    try {
      // Check if there's already a valid OTP
      const existingOTP = await OTP.isValidOTP(email, purpose);
      if (existingOTP) {
        return {
          success: false,
          message:
            "An OTP has already been sent to your email. Please check your inbox or wait before requesting a new one.",
          cooldown: true,
        };
      }

      // Create new OTP
      const otp = await OTP.createOTP(email, purpose);

      // Send OTP via email
      const emailResult = await EmailService.sendOTPEmail(email, otp, purpose);

      if (!emailResult.success) {
        // Clean up OTP if email failed
        await OTP.deleteMany({ email, purpose, otp });
        return {
          success: false,
          message: "Failed to send OTP email. Please try again.",
          error: emailResult.error,
        };
      }

      console.log(`✅ OTP generated and sent to ${email} for ${purpose}`);
      return {
        success: true,
        message: "OTP sent successfully to your email address",
        messageId: emailResult.messageId,
      };
    } catch (error) {
      console.error("❌ Error in generateAndSendOTP:", error);
      return {
        success: false,
        message: "Internal server error while generating OTP",
        error: error.message,
      };
    }
  }

  /**
   * Verify OTP provided by user
   * @param {string} email - User's email address
   * @param {string} otp - OTP provided by user
   * @param {string} purpose - Purpose of OTP verification
   * @returns {Object} - Verification result
   */
  async verifyOTP(email, otp, purpose = "registration") {
    try {
      // Input validation
      if (!email || !otp) {
        return {
          success: false,
          message: "Email and OTP are required",
        };
      }

      if (!/^\d{6}$/.test(otp)) {
        return {
          success: false,
          message: "OTP must be a 6-digit number",
        };
      }

      // Verify OTP using model method
      const result = await OTP.verifyOTP(email.toLowerCase(), otp, purpose);

      if (result.success) {
        console.log(`✅ OTP verified successfully for ${email} (${purpose})`);
      } else {
        console.log(
          `❌ OTP verification failed for ${email}: ${result.message}`
        );
      }

      return result;
    } catch (error) {
      console.error("❌ Error in verifyOTP:", error);
      return {
        success: false,
        message: "Internal server error while verifying OTP",
        error: error.message,
      };
    }
  }

  /**
   * Check if user has a valid OTP pending
   * @param {string} email - User's email address
   * @param {string} purpose - Purpose of OTP
   * @returns {Object} - Status result
   */
  async checkOTPStatus(email, purpose = "registration") {
    try {
      const hasValidOTP = await OTP.isValidOTP(email, purpose);

      if (hasValidOTP) {
        const otpDoc = await OTP.findOne({
          email,
          purpose,
          isUsed: false,
          expiresAt: { $gt: new Date() },
        });

        const timeLeft = Math.ceil((otpDoc.expiresAt - new Date()) / 1000 / 60); // minutes

        return {
          success: true,
          hasPendingOTP: true,
          timeLeft,
          attempts: otpDoc.attempts,
          maxAttempts: 5,
        };
      }

      return {
        success: true,
        hasPendingOTP: false,
        message: "No pending OTP found",
      };
    } catch (error) {
      console.error("❌ Error in checkOTPStatus:", error);
      return {
        success: false,
        message: "Error checking OTP status",
        error: error.message,
      };
    }
  }

  /**
   * Resend OTP (with cooldown protection)
   * @param {string} email - User's email address
   * @param {string} purpose - Purpose of OTP
   * @returns {Object} - Operation result
   */
  async resendOTP(email, purpose = "registration") {
    try {
      // Check if there's a recent OTP (less than 2 minutes old)
      const recentOTP = await OTP.findOne({
        email,
        purpose,
        createdAt: { $gt: new Date(Date.now() - 2 * 60 * 1000) }, // 2 minutes
      });

      if (recentOTP) {
        const waitTime = Math.ceil(
          (2 * 60 * 1000 - (Date.now() - recentOTP.createdAt)) / 1000
        );
        return {
          success: false,
          message: `Please wait ${waitTime} seconds before requesting a new OTP`,
          cooldown: true,
          waitTime,
        };
      }

      // Delete existing OTPs and generate new one
      await OTP.deleteMany({ email, purpose });
      return await this.generateAndSendOTP(email, purpose);
    } catch (error) {
      console.error("❌ Error in resendOTP:", error);
      return {
        success: false,
        message: "Error resending OTP",
        error: error.message,
      };
    }
  }

  /**
   * Clean up expired OTPs (maintenance function)
   * @returns {Object} - Cleanup result
   */
  async cleanupExpiredOTPs() {
    try {
      const result = await OTP.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          {
            isUsed: true,
            createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          }, // Delete used OTPs older than 24 hours
        ],
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} expired/used OTPs`);
      return {
        success: true,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      console.error("❌ Error in cleanupExpiredOTPs:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get OTP statistics (for admin/debugging)
   * @returns {Object} - Statistics
   */
  async getOTPStats() {
    try {
      const stats = await OTP.aggregate([
        {
          $group: {
            _id: "$purpose",
            totalOTPs: { $sum: 1 },
            usedOTPs: { $sum: { $cond: ["$isUsed", 1, 0] } },
            expiredOTPs: {
              $sum: { $cond: [{ $lt: ["$expiresAt", new Date()] }, 1, 0] },
            },
            avgAttempts: { $avg: "$attempts" },
          },
        },
      ]);

      const totalCount = await OTP.countDocuments();
      const activeCount = await OTP.countDocuments({
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      return {
        success: true,
        totalOTPs: totalCount,
        activeOTPs: activeCount,
        statsByPurpose: stats,
      };
    } catch (error) {
      console.error("❌ Error in getOTPStats:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new OTPService();
