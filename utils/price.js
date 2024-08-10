const {
  Connection,
  Keypair,
  VersionedTransaction,
  PublicKey,
} = require("@solana/web3.js");
const fetch = require("cross-fetch");
const { Wallet } = require("@project-serum/anchor");
const bs58 = require("bs58").default;
const crypto = require("crypto");

// Generate a new keypair for testing
// const keypair = Keypair.generate();
// console.log("Generated Public Key:", keypair.publicKey.toBase58());
// console.log("Generated Secret Key (base58):", bs58.encode(keypair.secretKey));

const base58EncodedSecretKey =
  process.env.PRIVATE_KEY ||
  "3xsJFvtgMopgYjm2YUHbYYqH8Wi1uMR4mZwXm5sKACSQiKNXek5Et2fjyVjiMDoZobDMZxFPom6qh29DJP7GqHA8";
//console.log(`Type of PRIVATE_KEY: ${typeof base58EncodedSecretKey}`);

const decodedSecretKey = bs58.decode(base58EncodedSecretKey);
//console.log(`Decoded Secret Key Length: ${decodedSecretKey.length}`);
//console.log(`Decoded Secret Key (hex): ${decodedSecretKey.toString("hex")}`);

if (decodedSecretKey.length !== 64) {
  throw new Error("Decoded secret key is not 64 bytes!");
}

// Ensure the decoded key is 64 bytes
const connection = new Connection(
  "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/"
);
const wallet = new Wallet(Keypair.fromSecretKey(decodedSecretKey));

// Example function to demonstrate the use of the wallet
async function getAccountInfo() {
  const accountInfo = await connection.getAccountInfo(wallet.publicKey);
  console.log(accountInfo);
}

//getAccountInfo().catch(console.error);

// Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
async function GetQuote(tokenBuyAddress, tokenSellAddress) {
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${tokenSellAddress}\
              &outputMint=${tokenBuyAddress}\
              &amount=100000000\
              &slippageBps=50`;

  try {
    const response = await fetch(url);
    const quoteResponse = await response.json();
    return quoteResponse;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error; // Optionally handle or rethrow the error
  }
}

// get serialized transactions for the swap
async function BuyOrSell(tokenBuyAddress, tokenSellAddress) {
  const { swapTransaction } = await (
    await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse: await GetQuote(tokenBuyAddress, tokenSellAddress),
        // user public key to be used for the swap
        userPublicKey: wallet.publicKey.toString(),
        // auto wrap and unwrap SOL. default is true
        wrapAndUnwrapSol: true,
        // feeAccount is optional. Use if you want to charge a fee. feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    })
  ).json();

  // deserialize the transaction
  const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
  var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.log(transaction);

  // sign the transaction
  transaction.sign([wallet.payer]);

  // Execute the transaction
  const rawTransaction = transaction.serialize();
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await connection.confirmTransaction(txid);
  console.log(`https://solscan.io/tx/${txid}`);
}

module.exports = {
  GetQuote,
  BuyOrSell,
};
