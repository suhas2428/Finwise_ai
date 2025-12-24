const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (email, otp) => {
  await transporter.sendMail({
    from: `"FinWise AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "FinWise OTP Verification",
    html: `
      <h2>Your OTP: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};
