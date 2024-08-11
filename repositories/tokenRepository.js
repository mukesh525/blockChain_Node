const { Token } = require("../models/token"); // Adjust the path as needed

/**
 * Inserts a new token into the database.
 * @param {Object} tokenData - The token data to be inserted.
 * @returns {Promise<Object>} - The created token document.
 */
async function createToken(tokenData) {
  try {
    const token = new Token(tokenData);
    return await token.save();
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}

/**
 * Finds a token by its address.
 * @param {string} tokenAddress - The address of the token to find.
 * @returns {Promise<Object|null>} - The found token document or null if not found.
 */
async function findTokenByAddress(tokenAddress) {
  try {
    return await Token.findOne({ tokenAddress });
  } catch (error) {
    console.error("Error finding token:", error);
    throw error;
  }
}

/**
 * Get all Token.
 * @param {string} tokenAddress - The address of the token to find.
 * @returns {Promise<Object|null>} - The found token document or null if not found.
 */
async function findAllToken() {
  try {
    return await Token.find({});
  } catch (error) {
    console.error("Error finding token:", error);
    throw error;
  }
}

module.exports = {
  createToken,
  findTokenByAddress,
  findAllToken,
};
