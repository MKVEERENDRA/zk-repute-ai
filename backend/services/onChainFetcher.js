import { BigQuery } from '@google-cloud/bigquery';

// Simple in-memory cache (swap for Redis in prod)
const cache = {};
const CACHE_TTL = 60 * 60 * 12 * 1000; // 12 hours

const bigquery = new BigQuery();

function cacheKey(wallet) {
  return `onchain_${wallet}`;
}

export default async function onChainFetcher(wallet) {
  wallet = wallet.toLowerCase();
  const key = cacheKey(wallet);
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }

  // Helper to run a query
  async function runQuery(q) {
    const [rows] = await bigquery.query(q);
    return rows;
  }

  // --- Queries ---
  const erc20Q = `SELECT block_timestamp, from_address, to_address, token_address, token_symbol, value FROM ` +
    "`bigquery-public-data.crypto_ethereum.token_transfers`" +
    ` WHERE from_address = '${wallet}' OR to_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  const ethQ = `SELECT block_timestamp, from_address, to_address, value AS eth_value FROM ` +
    "`bigquery-public-data.crypto_ethereum.transactions`" +
    ` WHERE from_address = '${wallet}' OR to_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  const gasQ = `SELECT block_timestamp, from_address, to_address, gas_used, gas_price, value AS eth_spent FROM ` +
    "`bigquery-public-data.crypto_ethereum.transactions`" +
    ` WHERE from_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  const contractQ = `SELECT block_timestamp, from_address, to_address, contract_address, method_id, value AS eth_spent FROM ` +
    "`bigquery-public-data.crypto_ethereum.transaction_traces`" +
    ` WHERE from_address = '${wallet}' OR to_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  // DAO voting (example: add your DAO contract address)
  const daoContract = '0xYourDaoContract';
  const daoQ = `SELECT block_timestamp, from_address, contract_address, method_id, value AS vote_amount FROM ` +
    "`bigquery-public-data.crypto_ethereum.transaction_traces`" +
    ` WHERE contract_address = '${daoContract}' AND from_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  const nftQ = `SELECT block_timestamp, from_address, to_address, token_address AS nft_address, token_id, value AS nft_price FROM ` +
    "`bigquery-public-data.crypto_ethereum.nft_transfers`" +
    ` WHERE from_address = '${wallet}' OR to_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  // DEX swaps (example: add real contract addresses)
  const dexContracts = [
    '0xUniswapContractAddress',
    '0xSushiSwapContractAddress'
  ];
  const dexQ = `SELECT block_timestamp, from_address, to_address, contract_address, value AS swapped_amount FROM ` +
    "`bigquery-public-data.crypto_ethereum.transaction_traces`" +
    ` WHERE contract_address IN (${dexContracts.map(a => `'${a}'`).join(', ')}) AND from_address = '${wallet}' ORDER BY block_timestamp DESC LIMIT 50`;

  // Run all queries in parallel
  const [erc20, eth, gas, contract, dao, nft, dex] = await Promise.all([
    runQuery(erc20Q),
    runQuery(ethQ),
    runQuery(gasQ),
    runQuery(contractQ),
    runQuery(daoQ),
    runQuery(nftQ),
    runQuery(dexQ)
  ]);

  const result = { erc20, eth, gas, contract, dao, nft, dex };
  cache[key] = { ts: now, data: result };
  return result;
}