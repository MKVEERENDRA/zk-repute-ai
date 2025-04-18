import express from 'express';
import dotenv from 'dotenv';
import onchainRouter from './routes/onchain.js';
import githubRouter from './routes/github.js';
import twitterRouter from './routes/twitter.js';
import lensRouter from './routes/lens.js';
import farcasterRouter from './routes/farcaster.js';
import poapRouter from './routes/poap.js';
import stackoverflowRouter from './routes/stackoverflow.js';
import upiRouter from './routes/upi.js';
import zkKycRouter from './routes/zkKyc.js';
import mirrorParagraphRouter from './routes/mirrorParagraph.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/onchain', onchainRouter);
app.use('/api/github', githubRouter);
app.use('/api/twitter', twitterRouter);
app.use('/api/lens', lensRouter);
app.use('/api/farcaster', farcasterRouter);
app.use('/api/poap', poapRouter);
app.use('/api/stackoverflow', stackoverflowRouter);
app.use('/api/upi', upiRouter);
app.use('/api/zkKyc', zkKycRouter);
app.use('/api/mirror-paragraph', mirrorParagraphRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
