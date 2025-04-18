import express from 'express';
import { fetchUpiStatement, generateUpiProof } from '../services/upiFetcher.js';

const router = express.Router();

// Endpoint to upload and generate UPI proof
router.post('/proof', async (req, res) => {
  try {
    const filePath = req.body.filePath; // File path where UPI statement is stored (in real use, this will come as form data)
    const upiStatement = fetchUpiStatement(filePath);
    if (!upiStatement) {
      return res.status(400).json({ error: 'Invalid UPI statement' });
    }
    const proof = await generateUpiProof(upiStatement);
    res.json(proof);
  } catch (err) {
    console.error('Error generating UPI proof:', err);
    res.status(500).json({ error: 'Failed to generate UPI proof' });
  }
});

export default router;
