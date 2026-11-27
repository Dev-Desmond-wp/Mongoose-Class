const express = require('express');
require('dotenv').config()
require('./database/database')
const PORT = process.env.PORT || 2200;
const Userrouter = require('./routes/userRouter')

const app = express();
app.use(express.json());
app.use(Userrouter)


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})