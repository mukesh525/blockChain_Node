const { WatchTokens } = require("../models/watchToken"); // Adjust the path as needed

/**
 * Inserts a new token into the database.
 * @param {Object} tokenData - The token data to be inserted.
 * @returns {Promise<Object>} - The created token document.
 */
async function createWatchTokens(tokenData, id) {
  try {
    const watchTokens = new WatchTokens(tokenData, id);
    return await watchTokens.save();
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}

/**
 * Get all Token.
 * @param {string} tokenAddress - The address of the token to find.
 * @returns {Promise<Object|null>} - The found token document or null if not found.
 */
async function findAllWatchTokens() {
  try {
    return await WatchTokens.find({});
  } catch (error) {
    console.error("Error finding token:", error);
    throw error;
  }
}

module.exports = {
  createWatchTokens,
  findAllWatchTokens,
};
