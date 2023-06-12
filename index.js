const express = require('express');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 1339;

app.listen(PORT, () => {
    console.log(`Successfully running on port ${PORT}`);
});