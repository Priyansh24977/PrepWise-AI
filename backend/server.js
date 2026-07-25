import dotenv from "dotenv";
dotenv.config();

import app from './src/app.js';
import connectToDB from './src/config/database.js';
import dns from 'dns';



dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);


connectToDB();
// invokeGemniniAi();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


