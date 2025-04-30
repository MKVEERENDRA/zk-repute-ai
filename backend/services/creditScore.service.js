// backend/services/creditScore.service.js
const axios = require("axios");

const SUREPASS_API_KEY = process.env.SUREPASS_API_KEY;

async function fetchCreditScore({ pan, name, dob, mobile }) {
  const url = "https://kyc-api.surepass.io/api/v1/credit-score";
  const payload = {
    pan_number: pan,
    full_name: name,
    dob: dob,
    mobile: mobile
  };

  const headers = {
    Authorization: `Bearer ${SUREPASS_API_KEY}`,
    "Content-Type": "application/json"
  };

  const response = await axios.post(url, payload, { headers });
  const creditData = response.data;

  return {
    score: creditData.score,
    bureau: creditData.bureau,
    credit_age: creditData.credit_age,
    accounts: creditData.account_summary,
    payment_history: creditData.payment_history,
    credit_utilization: creditData.credit_utilization
  };
}

module.exports = { fetchCreditScore };
