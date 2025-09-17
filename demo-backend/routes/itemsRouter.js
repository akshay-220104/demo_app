const express = require('express');
const { getItems, deleteItem, createItem, updateItem } = require('../controllers/itemsController');

const router = express.Router();

router.get('/', getItems);
router.delete('/:id', deleteItem);
router.post('/', createItem);
router.put('/:id', updateItem)

module.exports = router;
