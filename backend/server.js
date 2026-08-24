import dotenv from "dotenv";
dotenv.config();

import dns from 'dns';
dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

import app from './src/app.js';
import connectToDB from './src/config/database.js';

connectToDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
