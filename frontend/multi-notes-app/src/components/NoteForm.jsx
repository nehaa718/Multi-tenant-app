import React, { useState, useEffect } from "react";

const NoteForm = ({ initial = { title:"", content:"" }, onSubmit, submitLabel, onCancel }) => {
  // Initialize only once
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);

  // Reset state only if initial changes AND modal is opening (optional)
  useEffect(() => {
    setTitle(initial.title);
    setContent(initial.content);
  }, [initial.title, initial.content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="card small-card">
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Note Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="4"
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" className="btn">{submitLabel}</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default NoteForm;
