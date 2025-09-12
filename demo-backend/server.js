const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const itemRoutes = require('./routes/itemsRouter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});