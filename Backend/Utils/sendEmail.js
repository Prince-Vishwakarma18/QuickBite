import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const SENDER = {
   name: "QuickBite",
   email: `${process.env.MAIL_USER}`,
};

const otpTemplate = (otp) => `
   <div style="font-family: Arial; padding: 20px;">
      <h2>QuickBite OTP</h2>
      <h1 style="color: #f97316;">${otp}</h1>
      <p>Valid for 10 minutes. Do not share with anyone.</p>
   </div>
`;

export const sendMail = async (email, otp) => {
   try {
      await axios.post(
         BREVO_URL,
         {
            sender: SENDER,
            to: [{ email }],
            subject: "Your QuickBite OTP",
            htmlContent: otpTemplate(otp),
         },
         {
            headers: {
               "api-key": process.env.BREVO_API_KEY,
               "Content-Type": "application/json",
            },
         },
      );
      return true;
   } catch (error) {
      console.log("Mail error:", error.response?.data || error.message);
      return false;
   }
};
