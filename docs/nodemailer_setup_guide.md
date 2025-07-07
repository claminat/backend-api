
# 🌐 Nodemailer Setup Guide for Sending Emails via Gmail

This guide explains how to set up **Nodemailer** for sending emails using a Gmail account, including how to configure **Gmail credentials**, **allow less secure apps**, and generate **App Passwords** if needed.

---

## 1. **Prerequisites**

- **Node.js** installed on your local machine.
- **Nodemailer** library installed in your project.

To install Nodemailer, run the following command:

```bash
npm install nodemailer
```

- A **Gmail account** that will be used to send emails.

---

## 2. **Setting Up Nodemailer**

### 2.1 Create a transporter in your Node.js application

To send an email using **Nodemailer**, you need to create a **transporter** which contains the Gmail SMTP configuration:

```js
const nodemailer = require('nodemailer');

// Set up Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Your Gmail address
    pass: 'your_app_password',    // Use an App Password if you have 2FA enabled
  },
});
```

---

## 3. **Configuring Gmail Credentials**

### 3.1 **If You Have 2FA Enabled (Recommended)**

If you have **2-factor authentication (2FA)** enabled for your Gmail account (which is **recommended** for better security), you cannot use your regular Gmail password in **Nodemailer**. Instead, you must generate an **App Password**.

### Steps to generate an **App Password**:
1. **Enable 2FA**:
   - Go to your **Google Account** → **Security Settings**.
   - Under **Signing in to Google**, click **2-Step Verification** and follow the prompts to enable 2FA.

2. **Generate an App Password**:
   - After enabling 2FA, go to **App Passwords** section: [Google App Passwords](https://myaccount.google.com/apppasswords).
   - Choose **Mail** as the app and **Other** as the device (e.g., "Nodemailer").
   - Click **Generate**, and you'll receive a 16-character App Password.

3. **Use App Password**:
   - Use this generated password in your Nodemailer setup as shown above, replacing your Gmail password.

---

### 3.2 **If You Do NOT Have 2FA Enabled**

If **2FA** is not enabled, Gmail may block sign-ins from external applications, and you’ll need to enable access for **less secure apps**.

### Steps to allow Less Secure Apps:
1. Go to your **Google Account** → **Security Settings**.
2. Scroll down to **Less secure app access**.
3. Turn **ON** access for less secure apps.
4. Now you can use your regular Gmail password in the **Nodemailer configuration**.

> **Note**: This option is **not recommended** because it lowers the security of your Gmail account. We highly suggest enabling **2FA** and using **App Passwords** instead.

---

## 4. **Sending an Email**

Once you’ve configured **Nodemailer** with your Gmail credentials, you can send an email like this:

```js
const mailOptions = {
  from: 'your_email@gmail.com',     // Sender's email address
  to: 'recipient_email@example.com', // Recipient's email address
  subject: 'Test Email',             // Email subject
  text: 'This is a test email sent using Nodemailer and Gmail!', // Email content
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
```

---

## 5. **Common Errors & Troubleshooting**

### 5.1 **Invalid login: 535-5.7.8 Username and Password not accepted**
This error occurs when Gmail blocks the login attempt. It usually happens if you haven’t allowed **less secure apps** or haven’t generated an **App Password** for your account.

- If you have **2FA enabled**, make sure you're using an **App Password**.
- If **2FA is not enabled**, turn on **Less Secure App Access** for Gmail.

### 5.2 **Email Sending Delays or Failures**
Sometimes, Gmail may delay emails if you send too many in a short time. If you're sending emails programmatically, make sure you're not violating Gmail's rate limits.

---

## 6. **Conclusion**

By following this guide, you should be able to send emails via Gmail using **Nodemailer** with either regular Gmail credentials (if **2FA** is disabled) or **App Passwords** (if **2FA** is enabled). We highly recommend enabling **2FA** and using **App Passwords** to secure your Gmail account.

If you encounter any errors or need further assistance, feel free to ask!

---

### **Resources**:
- [Google App Passwords](https://myaccount.google.com/apppasswords)
- [Nodemailer Documentation](https://nodemailer.com/about/)
