import express from 'express';
import dotenv from 'dotenv';
import onchainRouter from './routes/onchain.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/api/onchain', onchainRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
