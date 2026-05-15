import { HeartFill, Heart } from "react-bootstrap-icons";

const ImageCard = ({
  image,
  isOwner,
  deletingImageId,
  setSelectedImage,
  handleDeleteImage,
  toggleFavorite,
}) => {
  return (
    <div className="col-md-6 col-lg-4 col-xl-3">
      <div
        className="image-card"
        onClick={() => setSelectedImage(image)}
      >
        {/* IMAGE */}
        <img
          src={image.imageUrl}
          alt={image.name}
        />

        {/* BODY */}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start gap-2">
            
            {/* NAME */}
            <h6 className="mb-0">
              {image.name.slice(0, 20)}
            </h6>

            <div className="d-flex align-items-center gap-2">
              
              {/* DELETE */}
              {isOwner && (
                <button
                  className="delete-image-btn"
                  disabled={deletingImageId === image.imageId}
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDeleteImage(image.imageId);
                  }}
                >
                  {deletingImageId === image.imageId
                    ? "Deleting..."
                    : "Delete"}
                </button>
              )}

              {/* FAVORITE */}
              {isOwner && (
                <button
                  className={`favorite-btn ${
    image.isFavorite ? "active" : ""
  }`}
                  onClick={(e) => {
                    e.stopPropagation();

                    toggleFavorite(
                      image.imageId,
                      image.isFavorite
                    );
                  }}
                >
                  {image.isFavorite ? (
                    <HeartFill
                      size={18}
                      color="#ff4d6d"
                    />
                  ) : (
                    <Heart
                      size={18}
                     
                    />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* PERSON */}
          {image.person && (
            <div className="mt-2">
              <small className="person-badge">
                👤 {image.person}
              </small>
            </div>
          )}

          {/* TAGS */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            {image.tags?.map((tag, index) => (
              <span
                key={index}
                className="badge tag-badge"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* COMMENTS */}
          <div className="mt-3">
            <small className="text-secondary">
              {image.comments?.length || 0} comments
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;