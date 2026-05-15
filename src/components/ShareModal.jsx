const ShareModal = ({
  showShareModal,
  setShowShareModal,
  shareEmails,
  setShareEmails,
  handleShareAlbum,
  sharing,
}) => {
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
          <label className="form-label">
            User Emails
          </label>

          <input
            type="text"
            value={shareEmails}
            onChange={(e) =>
              setShareEmails(e.target.value)
            }
            placeholder="john@gmail.com, jane@gmail.com"
            className="form-control dark-input"
          />

          <small className="text-secondary mt-2 d-block">
            Separate multiple emails with commas
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
            {sharing
              ? "Sharing..."
              : "Share Album"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;