const bcrypt = require('bcrypt');
/**The salt rounds in bcrypt refer to the computational cost factor, also known as the work factor. 
 * It determines how many times the hashing algorithm will be applied. In bcrypt, the number of salt rounds (or cost factor) 
 *  exponentially increases the time it takes to hash a password.

    Explanation of Salt Rounds
        Salt Generation: When bcrypt hashes a password, it generates a random salt. 
        The salt is combined with the password before hashing to ensure that even if two users have the same password, their hashes will be different.

    Cost Factor: 
        The cost factor, or salt rounds, determines the number of iterations the hashing algorithm goes through. 
        The higher the cost factor, the more time-consuming the hash calculation becomes.

    Why Use Salt Rounds?
        Security: 
            Increasing the cost factor makes the hashing process more time-consuming. 
            This helps to mitigate brute force attacks because it increases the time required to guess each password.
        Scalability: 
            As computing power increases over time, you can increase the cost factor to make sure that the hash calculation remains sufficiently slow to deter attackers.
    Choosing Salt Rounds
        A common practice is to start with a cost factor of 10, which is a good balance between security and performance for most applications. 
        However, you should test different values to find a balance that works for your specific environment.

    Performance Considerations
        Lower Cost Factor: 
            Faster hashing, less secure. Suitable for environments where performance is critical and the threat model is less concerning.
        Higher Cost Factor: 
            Slower hashing, more secure. Suitable for environments where security is a primary concern, even at the expense of performance.
 * 
 */
const saltRounds = 10;

// Function to hash a password
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        throw new Error('Error hashing password: ' + err.message);
    }
}

// Function to verify a password
async function verifyPassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (err) {
        throw new Error('Error verifying password: ' + err.message);
    }
}

// Export the functions for use in other files
module.exports = {
    hashPassword,
    verifyPassword
};
