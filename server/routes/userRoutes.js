const express = require("express"); // ✅ This uses express.Router(), NOT 'router'
const protect = require("../middleware/protect"); // ✅ Correct import

const { getUserData, storeRecentSearchedCities } = require("../controllers/userController");

const router = express.Router(); // ✅ Using express.Router()

router.get("/data", protect, getUserData);
router.post("/recent-city", protect, storeRecentSearchedCities);

module.exports = router;
