const express = require('express');

const {
  getAllCrypto,
  getGainers,
  getNewListings,
  addCrypto,
  updateCrypto,
} = require('../controllers/cryptoController');

const router = express.Router();

router.get('/', getAllCrypto);
router.get('/gainers', getGainers);
router.get('/new', getNewListings);
router.post('/', addCrypto);
router.patch('/:symbol', updateCrypto);

module.exports = router;
