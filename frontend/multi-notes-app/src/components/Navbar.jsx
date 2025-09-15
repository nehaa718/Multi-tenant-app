import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import API from "../api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviteMsg, setInviteMsg] = useState("");

  const submitInvite = async (e) => {
    e.preventDefault();
    setInviteMsg("");
    try {
      const res = await API.post("/tenants/invite", { email: inviteEmail, role: inviteRole });
      setInviteMsg(res.data.message || "User invited");
      setInviteEmail("");
    } catch (err) {
      setInviteMsg(err.response?.data?.message || "Invite failed");
    }
  };

  return (
    <>
      <nav className="navbar card" style={{display:'flex', justifyContent:'space-between', padding:'8px 16px', marginBottom:'20px'}}>
        <div className="brand"><strong>SaaS Notes</strong></div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <div>{user?.email} <small>({user?.role})</small></div>
          {user?.role === "Admin" && <button className="btn small" onClick={() => setShowInvite(true)}>Invite</button>}
          <button className="btn small ghost" onClick={logout}>Logout</button>
        </div>
      </nav>

      <Modal show={showInvite} onClose={() => setShowInvite(false)} title="Invite User">
        <form onSubmit={submitInvite}>
          <label>Email</label>
          <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required />
          <label>Role</label>
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
            <option>Member</option>
            <option>Admin</option>
          </select>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn" type="submit">Send Invite</button>
            <button type="button" className="btn-cancel" onClick={() => setShowInvite(false)}>Close</button>
          </div>
        </form>
        {inviteMsg && <p style={{ marginTop: 10 }}>{inviteMsg}</p>}
      </Modal>
    </>
  );
};

export default Navbar;
