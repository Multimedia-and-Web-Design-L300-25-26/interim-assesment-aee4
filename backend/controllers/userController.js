const User = require('../models/User');

async function getProfile(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const user = await User.findById(userId).select('name email createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { getProfile };
