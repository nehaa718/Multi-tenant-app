import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import Modal from "../components/Modal";

const Notes = () => {
  const { user, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setLoading(true); setError("");
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
      setLimitReached(res.data.length >= 3); // assume Free until upgrade
    } catch(err) {
      if(err.response?.status===401) { logout(); navigate("/login"); }
      else setError(err.response?.data?.message || "Failed to load notes");
    } finally { setLoading(false); }
  };

  useEffect(()=>{ if(user) fetchNotes(); else navigate("/login"); }, [user]);

  const createNote = async (payload) => {
    setError(""); try {
      await API.post("/notes", payload);
      await fetchNotes(); setShowAdd(false); setUpgradeMsg("");
    } catch(err){ setError(err.response?.data?.message || "Failed to create note"); }
  };

  const updateNote = async (payload) => {
    try { await API.put(`/notes/${editing._id}`, payload); setEditing(null); await fetchNotes(); }
    catch(err){ setError(err.response?.data?.message || "Failed to update note"); }
  };

  const deleteNote = async (id) => {
    try { await API.delete(`/notes/${id}`); await fetchNotes(); }
    catch(err){ setError("Failed to delete note"); }
  };

  const handleUpgrade = async () => {
    setUpgradeMsg("");
    try {
      await API.post(`/tenants/${user.tenant}/upgrade`);
      setUpgradeMsg("Upgraded to Pro. Notes now unlimited.");
      setLimitReached(false); await fetchNotes();
    } catch(err){ setUpgradeMsg(err.response?.data?.message || "Upgrade failed"); }
  };

  return (
    <div className="notes-wrapper">
      <div className="notes-header">
        <h1 className="app-title">{user?.tenant ? `${capitalize(user.tenant)} Notes` : "Notes"}</h1>
        <button className="btn" onClick={()=>setShowAdd(true)}>Add Note</button>
      </div>

      {error && <p className="error">{error}</p>}
      {upgradeMsg && <p className="success">{upgradeMsg}</p>}

      <NoteList notes={notes} onDelete={deleteNote} onEdit={setEditing} />

      {limitReached && (
        <div className="limit-banner">
          <div>You've reached your limit. <strong>Upgrade to Pro for unlimited notes!</strong></div>
          {user?.role==="Admin" ? (
            <button className="upgrade-btn" onClick={handleUpgrade}>Upgrade to Pro</button>
          ) : (
            <button className="upgrade-btn ghost" disabled>Upgrade to Pro</button>
          )}
        </div>
      )}

      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title="Add Note">
        <NoteForm onSubmit={createNote} submitLabel="Create" onCancel={()=>setShowAdd(false)} />
      </Modal>

      <Modal show={!!editing} onClose={()=>setEditing(null)} title="Edit Note">
        {editing && <NoteForm initial={{title:editing.title, content:editing.content}} onSubmit={updateNote} submitLabel="Save" onCancel={()=>setEditing(null)} />}
      </Modal>
    </div>
  );
};

function capitalize(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ""; }
export default Notes;
