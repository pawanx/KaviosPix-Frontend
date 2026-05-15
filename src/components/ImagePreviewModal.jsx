import {
  Heart,
  HeartFill,
  Trash,
  X,
  SendFill,
} from "react-bootstrap-icons";

const ImagePreviewModal = ({
  selectedImage,
  setSelectedImage,
  isOwner,
  toggleFavorite,
  handleDeleteImage,
  commentInputs,
  handleCommentChange,
  handleAddComment,
}) => {
  if (!selectedImage) return null;

  return (
    <div
      className="preview-backdrop"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row g-0">
          {/* IMAGE */}
          <div className="col-lg-8">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.name}
              className="preview-image"
            />
          </div>

          {/* SIDEBAR */}
          <div className="col-lg-4">
            <div className="preview-sidebar">
              {/* TOP */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold mb-2">
                    {selectedImage.name}
                  </h4>

                  {selectedImage.person && (
                    <span className="person-badge">
                      👤 {selectedImage.person}
                    </span>
                  )}
                </div>

                <button
                  className="image-modal-close-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  <X />
                </button>
              </div>

              {/* TAGS */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {selectedImage.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="badge tag-badge"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="d-flex align-items-center gap-3 mb-4">
                {/* FAVORITE */}
                <button
                  className={`favorite-btn ${
                    selectedImage.isFavorite
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleFavorite(
                      selectedImage.imageId,
                      selectedImage.isFavorite,
                    )
                  }
                >
                  {selectedImage.isFavorite ? (
                    <HeartFill size={18} />
                  ) : (
                    <Heart size={18} />
                  )}
                </button>

                {/* DELETE */}
                {isOwner && (
                  <button
                    className="delete-image-btn"
                    onClick={() =>
                      handleDeleteImage(
                        selectedImage.imageId,
                      )
                    }
                  >
                    <Trash size={15} />
                    Delete
                  </button>
                )}
              </div>

              {/* COMMENTS */}
              <div className="flex-grow-1 d-flex flex-column">
                <h5 className="fw-bold mb-3">
                  Comments
                </h5>

                <div className="preview-comments">
                  {selectedImage.comments?.length > 0 ? (
                    selectedImage.comments.map(
                      (comment, index) => (
                        <div
                          key={index}
                          className="comment-box"
                        >
                          {comment}
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-secondary">
                      No comments yet.
                    </p>
                  )}
                </div>

                {/* COMMENT INPUT */}
                <div className="mt-4">
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={
                        commentInputs[
                          selectedImage.imageId
                        ] || ""
                      }
                      onChange={(e) =>
                        handleCommentChange(
                          selectedImage.imageId,
                          e.target.value,
                        )
                      }
                      className="comment-input"
                    />

                    <button
                      className="comment-btn"
                      onClick={() =>
                        handleAddComment(
                          selectedImage.imageId,
                        )
                      }
                    >
                      <SendFill />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;