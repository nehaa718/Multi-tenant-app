const router = require("express").Router();
const { auth } = require("../middleware/authMiddleware");
const { createNote, getNotes, getNote, updateNote, deleteNote } = require("../controllers/notesController");

router.use(auth);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
