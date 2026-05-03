const express = require('express');

const {
  getAllCrypto,
  getGainers,
  getNewListings,
  addCrypto,
} = require('../controllers/cryptoController');

const router = express.Router();

router.get('/', getAllCrypto);
router.get('/gainers', getGainers);
router.get('/new', getNewListings);
router.post('/', addCrypto);

module.exports = router;
