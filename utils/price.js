import { Connection, Keypair, VersionedTransaction, PublicKey } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { Wallet } from '@project-serum/anchor';
import bs58 from 'bs58';

// It is recommended that you use your own RPC endpoint.
// This RPC endpoint is only for demonstration purposes so that this example will run.
const connection = new Connection('https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/');

const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || '')));

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
      console.error('Error fetching quote:', error);
      throw error; // Optionally handle or rethrow the error
  }
}

// console.log({ quoteResponse })

// get serialized transactions for the swap
async function BuyOrSell(tokenBuyAddress, tokenSellAddress) {
const { swapTransaction } = await (
  await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // quoteResponse from /quote api
      quoteResponse: await GetQuote(tokenBuyAddress, tokenSellAddress),
      // user public key to be used for the swap
      userPublicKey: wallet.publicKey.toString(),
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
    })
  })
).json();

// deserialize the transaction
const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
console.log(transaction);

// sign the transaction
transaction.sign([wallet.payer]);

// Execute the transaction
const rawTransaction = transaction.serialize()
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
  maxRetries: 2
});
await connection.confirmTransaction(txid);
console.log(`https://solscan.io/tx/${txid}`);
}

module.exports = {
  GetQuote,
  BuyOrSell
};