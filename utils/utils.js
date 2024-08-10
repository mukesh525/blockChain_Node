sendPushAll = async (tokens, data) => {
  console.log("Hello");
};

async function getTokenBalanceWeb3(connection, tokenAccount) {
  const info = await connection.getTokenAccountBalance(tokenAccount);
  if (info.value.uiAmount == null) throw new Error("No balance found");
  console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
  return info.value.uiAmount;
}

exports.sendPushAll = sendPushAll;
