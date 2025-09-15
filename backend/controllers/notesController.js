const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const tenant = req.user.tenant;

  // Free plan limit
  if (tenant.subscription === "Free") {
    const count = await Note.countDocuments({ tenant: tenant._id });
    if (count >= 3) return res.status(403).json({ message: "Free plan limit reached" });
  }

  const note = await Note.create({ title, content, tenant: tenant._id, createdBy: req.user._id });
  res.status(201).json(note);
};

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ tenant: req.user.tenant._id }).sort({ createdAt: -1 });
  res.json(notes);
};

exports.getNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
};

exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenant._id },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, tenant: req.user.tenant._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json({ message: "Note deleted" });
};
