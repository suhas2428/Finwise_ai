const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendWarningEmail = async ({ to, type, salary, expenses }) => {
  const subject =
    type === "danger"
      ? "🚨 Salary Limit Exceeded – FinWise AI"
      : "⚠️ Spending Caution – FinWise AI";

  const message =
    type === "danger"
      ? "Your expenses have exceeded your salary."
      : "You are close to exceeding your salary.";

  await transporter.sendMail({
    from: `"FinWise AI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <h2>${subject}</h2>
      <p>${message}</p>
      <hr/>
      <p><b>Monthly Salary:</b> ₹${salary}</p>
      <p><b>Total Expenses:</b> ₹${expenses}</p>
      <br/>
      <p>Please review your expenses.</p>
      <p>— FinWise AI</p>
    `,
  });
};
