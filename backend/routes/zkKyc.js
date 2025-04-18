import express from 'express';
import { fetchKycData, generateZkKycProof } from '../services/zkKycFetcher.js';

const router = express.Router();

// Endpoint to upload and generate KYC proof
router.post('/proof', async (req, res) => {
  try {
    const filePath = req.body.filePath; // File path where KYC data is stored (in real use, this will come as form data)
    const kycData = fetchKycData(filePath);
    if (!kycData) {
      return res.status(400).json({ error: 'Invalid KYC data' });
    }
    const proof = await generateZkKycProof(kycData);
    res.json(proof);
  } catch (err) {
    console.error('Error generating KYC proof:', err);
    res.status(500).json({ error: 'Failed to generate KYC proof' });
  }
});

export default router;
