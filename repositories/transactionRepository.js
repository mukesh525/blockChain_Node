const { Transactions } = require("../models/transaction"); // Adjust the path as needed

/**
 * Inserts a new token into the database.
 * @param {Object} tokenData - The token data to be inserted.
 * @returns {Promise<Object>} - The created token document.
 */
async function createTransaction(transactionData) {
  try {
    const transaction = new Transactions(transactionData);
    return await transaction.save();
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
async function findTransactionsByAddress(tokenAddress) {
  try {
    return await Transactions.findOne({ tokenAddress });
  } catch (error) {
    console.error("Error finding token:", error);
    throw error;
  }
}

/**
 * Get All Transactions.
 */
async function findAllTransactions() {
  try {
    return await Transactions.find({});
  } catch (error) {
    console.error("Error finding token:", error);
    throw error;
  }
}

/**
 * Updates the token balance of a specific transaction.
 * @param {string} transactionId - The ID of the transaction to update.
 * @param {number} newBalance - The new token balance to set.
 * @returns {Promise<void>}
 */
async function updateTransactionBalance(transactionId, newBalance) {
  try {
    await Transaction.findByIdAndUpdate(
      transactionId,
      { tokenBalance: newBalance },
      { new: true }
    );
    console.log(
      `Transaction ${transactionId} updated with new balance: ${newBalance}`
    );
  } catch (error) {
    console.error(`Failed to update transaction ${transactionId}:`, error);
    throw error; // Optionally rethrow the error to handle it elsewhere
  }
}
module.exports = {
  createTransaction,
  findTransactionsByAddress,
  findAllTransactions,
  updateTransactionBalance,
};
