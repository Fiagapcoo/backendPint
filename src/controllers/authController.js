const db = require('../models');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email'); // Implement your email sending logic


const controllers = {}; 


controllers.register = async (req, res) => {
    const { email, firstName, lastName } = req.body;

    try {
        // Create the user in the database without a password
        const user = await db.User.create({ email, firstName, lastName });

        // Generate JWT token for password setup
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // URL for password setup
        const url = `${process.env.CLIENT_URL}/setup-password?token=${token}`;

        // Send email to user
        await sendEmail(user.email, 'Set up your password', `Click this link to set up your password: ${url}`);

        res.status(201).json({ message: 'User registered successfully. Please check your email to set up your password.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

controllers.setupPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user with the new password
        await db.User.update({ password: hashedPassword }, { where: { id: userId } });

        // Send confirmation email
        const user = await db.User.findByPk(userId);
        await sendEmail(user.email, 'Password Setup Successful', 'Your password has been set up successfully.');

        res.status(200).json({ message: 'Password set up successfully.' });
    } catch (error) {
        console.error('Error setting up password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = controllers;