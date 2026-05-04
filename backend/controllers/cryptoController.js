const Crypto = require('../models/Crypto');

async function getAllCrypto(req, res) {
  try {
    const cryptos = await Crypto.find();
    return res.status(200).json(cryptos);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

async function getGainers(req, res) {
  try {
    const cryptos = await Crypto.find().sort({ change24h: -1 });
    return res.status(200).json(cryptos);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

async function getNewListings(req, res) {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    return res.status(200).json(cryptos);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

async function addCrypto(req, res) {
  try {
    const { name, symbol, price, image, change24h } = req.body || {};

    if (!name || !symbol || price === undefined || change24h === undefined) {
      return res.status(400).json({
        message: 'Name, symbol, price, and change24h are required.',
      });
    }

    if (Number.isNaN(Number(price))) {
      return res.status(400).json({ message: 'Price must be a number.' });
    }

    if (Number.isNaN(Number(change24h))) {
      return res.status(400).json({ message: 'change24h must be a number.' });
    }

    const crypto = new Crypto({ name, symbol, price, image, change24h });
    await crypto.save();

    return res.status(201).json({
      message: 'Crypto added successfully.',
      crypto,
    });
  } catch (error) {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Server error.' });
  }
}

async function updateCrypto(req, res) {
  try {
    const { symbol } = req.params;
    const { name, symbol: newSymbol, price, image, change24h } = req.body || {};
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (newSymbol !== undefined) updates.symbol = newSymbol;
    if (image !== undefined) updates.image = image;

    if (price !== undefined) {
      if (Number.isNaN(Number(price))) {
        return res.status(400).json({ message: 'Price must be a number.' });
      }

      updates.price = price;
    }

    if (change24h !== undefined) {
      if (Number.isNaN(Number(change24h))) {
        return res.status(400).json({ message: 'change24h must be a number.' });
      }

      updates.change24h = change24h;
    }

    const crypto = await Crypto.findOneAndUpdate({ symbol }, updates, {
      new: true,
      runValidators: true,
    });

    if (!crypto) {
      return res.status(404).json({ message: 'Crypto not found.' });
    }

    return res.status(200).json(crypto);
  } catch (error) {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  getAllCrypto,
  getGainers,
  getNewListings,
  addCrypto,
  updateCrypto,
};
