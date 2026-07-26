dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);
import dotenv from "dotenv";
dotenv.config();

import app from './src/app.js';
import connectToDB from './src/config/database.js';
import dns from 'dns';






connectToDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


