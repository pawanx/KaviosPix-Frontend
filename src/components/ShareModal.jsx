import { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "../api/axios";
const ShareModal = ({
  showShareModal,
  setShowShareModal,
  shareEmails,
  setShareEmails,
  handleShareAlbum,
  sharing,
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelection = (selected) => {
    setSelectedUsers(selected || []);

    setShareEmails((selected || []).map((user) => user.value).join(","));
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedUsers = response.data.users.map((user) => ({
        value: user.email,
        label: `${user.name} (${user.email})`,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showShareModal) {
      fetchUsers();
    }
  }, [showShareModal]);

  if (!showShareModal) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        {/* HEADER */}
        <div className="custom-modal-header">
          <h5>Share Album</h5>

          <button
            className="modal-close-btn"
            onClick={() => setShowShareModal(false)}
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="custom-modal-body">
          <label className="form-label">User Emails</label>

          {/* <input
            type="text"
            value={shareEmails}
            onChange={(e) => setShareEmails(e.target.value)}
            placeholder="john@gmail.com, jane@gmail.com"
            className="form-control dark-input"
          /> */}

          <Select
            isMulti
            options={users}
            value={selectedUsers}
            onChange={handleSelection}
            placeholder="Search users..."
            className="text-dark"
            styles={{
              control: (base) => ({
                ...base,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
                minHeight: "48px",
              }),

              menu: (base) => ({
                ...base,
                background: "#1f2937",
                color: "white",
              }),

              option: (base, state) => ({
                ...base,
                background: state.isFocused ? "#374151" : "#1f2937",
                color: "white",
                cursor: "pointer",
              }),

              multiValue: (base) => ({
                ...base,
                background: "linear-gradient(135deg,#f6ac5c,#e4791b)",
                color: "white",
              }),

              multiValueLabel: (base) => ({
                ...base,
                color: "white",
              }),

              input: (base) => ({
                ...base,
                color: "white",
              }),

              singleValue: (base) => ({
                ...base,
                color: "white",
              }),

              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
              }),
            }}
          />

          <small className="text-secondary mt-2 d-block">
            Choose one or multiple users
          </small>
        </div>

        {/* FOOTER */}
        <div className="custom-modal-footer">
          <button
            className="cancel-btn"
            onClick={() => setShowShareModal(false)}
          >
            Cancel
          </button>

          <button
            className="submit-btn"
            disabled={sharing}
            onClick={handleShareAlbum}
          >
            {sharing ? "Sharing..." : "Share Album"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
