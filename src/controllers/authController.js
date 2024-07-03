const db = require('../models');
const jwt = require('jsonwebtoken');
const { sendMail } = require('./emailController'); 
const {spRegisterNewUser} = require ('../database/logic_objects/securityProcedures');


const controllers = {}; 

function mashupAndRandomize(email, firstName, lastName) {
    // Combine the strings
    const combinedString = email + firstName + lastName;
  
    // Convert the combined string into an array of characters
    const charArray = combinedString.split('');
  
    // Function to shuffle the array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // Shuffle the array
    const shuffledArray = shuffleArray(charArray);
  
    // Convert the shuffled array back to a string
    const randomizedString = shuffledArray.join('');
  
    return randomizedString;
  }
  

controllers.register = async (req, res) => {
    const { email, firstName, lastName, centerId } = req.body;

    try {
        // Create the user in the database without a password
        //const user = await db.User.create({ email, first_name:firstName, last_name:lastName });
        const user = await spRegisterNewUser (firstName, lastName, email, centerId);
        console.log("OLA")
        console.log('user:', user);
        // Generate JWT token for password setup
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const result = mashupAndRandomize(email, firstName, lastName);
        // URL for password setup
        const url = `${process.env.CLIENT_URL}/${result}/setup-password?token=${token}`;
        console.log('url:', url);
        console.log('user:', user);
        // Send email to user
        await sendMail({to: email, subject: 'Set up your password', body: `Click this link to set up your password: ${url}`});

        res.status(201).json({succes:true, message: 'User registered successfully. Please check your email to set up your password.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({succes:false, message: 'Internal server error' + error });
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
        await sendMail(user.email, 'Password Setup Successful', 'Your password has been set up successfully.');

        res.status(200).json({succes:true, message: 'Password set up successfully.' });
    } catch (error) {
        console.error('Error setting up password:', error);
        res.status(500).json({succes:false, message: 'Internal server error' });
    }
};

controllers.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '4h' });

        res.status(200).json({ token, success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

controllers.login_mobile = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = controllers;