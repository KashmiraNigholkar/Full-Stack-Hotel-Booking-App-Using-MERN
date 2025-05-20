// controllers/userController.js

const getUserData = async (req, res) => {
  try {
    const { role, recentSearchedCities } = req.user;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body; // singular city expected
    const user = req.user;

    if (!recentSearchedCity) {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    if (!user.recentSearchedCities.includes(recentSearchedCity)) {
      if (user.recentSearchedCities.length >= 3) {
        user.recentSearchedCities.shift(); // remove oldest
      }
      user.recentSearchedCities.push(recentSearchedCity);
    }

    await user.save();

    res.json({ success: true, message: "City added", recentSearchedCities: user.recentSearchedCities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserData,
  storeRecentSearchedCities,
};
