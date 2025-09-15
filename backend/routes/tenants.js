const router = require("express").Router();
const { auth } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { upgradeTenant, inviteUser } = require("../controllers/tenantsController");

router.use(auth);

// Upgrade tenant subscription (Admin only, uses :slug param)
router.post("/:slug/upgrade", isAdmin, upgradeTenant);

// Invite new user (Admin only)
router.post("/invite", isAdmin, inviteUser);

module.exports = router;
