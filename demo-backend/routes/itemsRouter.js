const express = require('express');
const { getItems } = require('../controllers/itemsController');

const router = express.Router();

router.get('/', getItems);

module.exports = router;
