const nodemailer = require('nodemailer');

//Configure the nodemailer transport object
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILRU_USER,
        pass: process.env.MAILRU_PASS
    }
});

/**
 * Send an email.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
const sendEmail = (req, res) => {
    const { to, subject, body } = req.body;

    const mailOptions = {
        from: process.env.MAILRU_USER,
        to: to,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
    });
};

module.exports = { sendEmail };
