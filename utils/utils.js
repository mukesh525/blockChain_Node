const transactionRepository = require("../repositories/transactionRepository");
const { BuyOrSell, GetQuote } = require("./price");
const { createWatchTokens } = require("../repositories/WatchtokenRepository");

processTransaction = async (job, done) => {
  const allTransactions = await transactionRepository.findAllTransactions();
  console.log("ProcessTransaction", allTransactions);
  // Example: Iterate over each transaction to check conditions
  for (const transaction of allTransactions) {
    let currentPrice = await getCurrentPrice(transaction.tokenAddress);
    // let currentPrice = await GetQuote(transaction.tokenAddress); // Get the current price of the token
    let buyPrice = transaction.tokenBuyPrice;

    // Check condition 1
    if (transaction.tokenBalance === 100 && currentPrice >= 2 * buyPrice) {
      condition1(transaction, currentPrice);
    }

    // Check condition 2
    if (currentPrice <= 0.6 * buyPrice) {
      condition2(transaction, currentPrice);
    }

    // Check condition 3
    if (transaction.tokenBalance === 50 && currentPrice >= 8 * buyPrice) {
      condition3(transaction, currentPrice);
    }
  }

  done();
};

// Condition 1: Sell 50% of tokens if current price >= 2x buy price
condition1 = (transaction, currentPrice) => {
  console.log("Condition1 triggered");
  const amountToSell = transaction.tokenBalance * 0.5;

  // Execute buy or sell action
  BuyOrSell(transaction.tokenAddress, amountToSell);
  console.log(`Sold 50% of tokens at price ${currentPrice}`);

  // Update the transaction record to reflect the new balance
  transactionRepository.updateTransactionBalance(
    transaction.id,
    transaction.tokenBalance - amountToSell
  );
};

// Condition 2: Check if the current price <= 60% of buy price
condition2 = async (transaction, currentPrice) => {
  console.log(`Condition 2 met for transaction ${transaction._id}`);
  // Example action: Sell a portion of the remaining tokens
  const amountToSell = transaction.tokenBalance * 0.5; // Example: Sell 50% of the remaining tokens
  await BuyOrSell(transaction.tokenAddress, amountToSell);

  // Update the transaction balance in the database
  const newBalance = transaction.tokenBalance - amountToSell;
  await updateTransactionBalance(transaction._id, newBalance);

  console.log(
    `Transaction ${transaction._id}: Sold ${amountToSell} tokens, new balance is ${newBalance}`
  );

  // Here you can implement actions based on the condition
};

// Condition 3: Sell 50% of tokens if current price >= 8x buy price
condition3 = (transaction, currentPrice) => {
  console.log("Condition3 triggered");
  const amountToSell = transaction.tokenBalance * 0.5;

  // Execute buy or sell action
  BuyOrSell(transaction.tokenAddress, "USDC", amountToSell); // Replace 'USDC' with actual sell address
  console.log(`Sold 50% of tokens at price ${currentPrice}`);

  // Create a new watch token entry
  createWatchTokens(transaction.tokenAddress, transaction.id);

  // Update the transaction record to reflect the new balance
  transactionRepository.updateTransactionBalance(
    transaction.id,
    transaction.tokenBalance - amountToSell
  );
};

// Example function to fetch the current price of a token
const getCurrentPrice = async (tokenAddress) => {
  // Replace this with actual API call to fetch the current price
  return 20; // Dummy value
  return GetQuote(tokenAddress);
};

getTokenBalanceWeb3 = async (connection, tokenAccount) => {
  const info = await connection.getTokenAccountBalance(tokenAccount);
  if (info.value.uiAmount == null) throw new Error("No balance found");
  console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
  return info.value.uiAmount;
};

exports.getTokenBalanceWeb3 = getTokenBalanceWeb3;
exports.processTransaction = processTransaction;
