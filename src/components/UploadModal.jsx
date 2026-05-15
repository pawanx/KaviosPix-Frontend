const UploadModal = ({
  showUploadModal,
  setShowUploadModal,
  handleUploadImage,
  handleImageChange,
  imageData,
  uploading,
}) => {
  if (!showUploadModal) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        
        {/* HEADER */}
        <div className="custom-modal-header">
          <h5>Upload Image</h5>

          <button
            className="modal-close-btn"
            onClick={() => setShowUploadModal(false)}
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleUploadImage}>
          <div className="custom-modal-body">
            
            {/* IMAGE */}
            <div className="mb-3">
              <label className="form-label">
                Select Image
              </label>

              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
                className="form-control dark-input"
                required
              />
            </div>

            {/* TAGS */}
            <div className="mb-3">
              <label className="form-label">
                Tags
              </label>

              <input
                type="text"
                name="tags"
                value={imageData.tags}
                onChange={handleImageChange}
                placeholder="nature,travel"
                className="form-control dark-input"
              />
            </div>

            {/* PERSON */}
            <div className="mb-3">
              <label className="form-label">
                Person
              </label>

              <input
                type="text"
                name="person"
                value={imageData.person}
                onChange={handleImageChange}
                placeholder="Tagged person"
                className="form-control dark-input"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="custom-modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;