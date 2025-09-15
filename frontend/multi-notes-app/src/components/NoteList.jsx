import React from "react";

const NoteList = ({ notes, onDelete, onEdit }) => {
  if (!notes.length) return <p>No notes found.</p>;
  return (
    <div style={{display:'flex', flexDirection:'column', gap:12}}>
      {notes.map(note => (
        <div key={note._id} className="card">
          <h4>{note.title}</h4>
          <p>{note.content}</p>
          <div style={{display:'flex', gap:10}}>
            <button className="btn ghost" onClick={()=>onEdit(note)}>Edit</button>
            <button className="btn danger" onClick={()=>onDelete(note._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
