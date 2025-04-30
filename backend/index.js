import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const routesDir = './routes';
const routes = fs.readdirSync(routesDir);

routes.forEach(route => {
  const router = require(path.join(routesDir, route));
  const routeName = route.replace('.js', '');
  app.use(`/api/${routeName}`, router);
});

const aadhaarAgeProofRouter = require('./routes/aadhaarAgeProof');
app.use('/api/aadhaar-age-proof', aadhaarAgeProofRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Enabled API routes:');
  routes.forEach(route => {
    const routeName = route.replace('.js', '');
    console.log(`/api/${routeName}`);
  });
  console.log('/api/aadhaar-age-proof');
});
