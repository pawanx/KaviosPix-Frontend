import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

import {
  ArrowLeft,
  HeartFill,
  Heart,
  Upload,
  Share,
} from "react-bootstrap-icons";

import axiosInstance from "../api/axios";

const AlbumDetails = () => {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const [deletingImageId, setDeletingImageId] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);

  const [shareEmails, setShareEmails] = useState("");

  const [sharing, setSharing] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [imageData, setImageData] = useState({
    tags: "",
    person: "",
  });

  const [album, setAlbum] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isOwner = album?.ownerId === currentUser?.userId;

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
  ========================================
  Fetch Album Details
  ========================================
  */

  const fetchAlbumDetails = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      /*
      ========================================
      Fetch Album
      ========================================
      */

      const albumResponse = await axiosInstance.get(
        `/albums/${albumId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
      ========================================
      Fetch Images
      ========================================
      */

      const imageResponse = await axiosInstance.get(
        `/albums/${albumId}/images`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAlbum(albumResponse.data.album);

      setImages(imageResponse.data.images);
    } catch (error) {
      console.log(error);

      setError("Failed to load album");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageData({
      ...imageData,

      [e.target.name]: e.target.files?.[0] || e.target.value,
    });
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      /*
    ========================================
    FormData
    ========================================
    */

      const formData = new FormData();

      formData.append("image", imageData.image);

      formData.append("tags", imageData.tags);

      formData.append("person", imageData.person);

      /*
    ========================================
    Upload API
    ========================================
    */

      const response = await axiosInstance.post(
        `/albums/${albumId}/images`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);

      /*
    ========================================
    Refresh Images
    ========================================
    */

      fetchAlbumDetails();

      /*
    ========================================
    Reset Form
    ========================================
    */

      setImageData({
        image: null,
        tags: "",
        person: "",
      });

      /*
    ========================================
    Close Modal
    ========================================
    */

      setShowUploadModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const toggleFavorite = async (imageId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      /*
    ========================================
    Update Favorite
    ========================================
    */

      await axiosInstance.put(
        `/albums/${albumId}/images/${imageId}/favorite`,

        {
          isFavorite: !currentStatus,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
    ========================================
    Update UI Instantly
    ========================================
    */

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.imageId === imageId
            ? {
                ...img,
                isFavorite: !currentStatus,
              }
            : img,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const confirmDelete = window.confirm("Delete this image permanently?");

      if (!confirmDelete) return;

      setDeletingImageId(imageId);

      const token = localStorage.getItem("token");

      /*
    ========================================
    Delete API
    ========================================
    */

      await axiosInstance.delete(
        `/albums/${albumId}/images/${imageId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
    ========================================
    Remove From UI
    ========================================
    */

      setImages((prevImages) =>
        prevImages.filter((img) => img.imageId !== imageId),
      );

      /*
    ========================================
    Close Modal If Same Image
    ========================================
    */

      if (selectedImage?.imageId === imageId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleCommentChange = (imageId, value) => {
    setCommentInputs((prev) => ({
      ...prev,

      [imageId]: value,
    }));
  };

  const handleAddComment = async (imageId) => {
    try {
      const token = localStorage.getItem("token");

      const comment = commentInputs[imageId];

      if (!comment?.trim()) return;

      /*
    ========================================
    API CALL
    ========================================
    */

      await axiosInstance.put(
        `/albums/${albumId}/images/${imageId}/comments`,

        {
          comment,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
    ========================================
    Update UI
    ========================================
    */

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.imageId === imageId
            ? {
                ...img,

                comments: [...img.comments, comment],
              }
            : img,
        ),
      );

      /*
    ========================================
    Clear Input
    ========================================
    */

      setCommentInputs((prev) => ({
        ...prev,

        [imageId]: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleShareAlbum = async () => {
    try {
      setSharing(true);

      const token = localStorage.getItem("token");

      await axiosInstance.post(
        `/albums/${albumId}/share`,

        {
          emails: shareEmails
            .split(",")

            .map((email) => email.trim())

            .filter(Boolean),
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Album shared successfully");

      setShareEmails("");

      setShowShareModal(false);

      fetchAlbumDetails();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to share album");
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
  }, [albumId]);

  useEffect(() => {
    if (selectedImage) {
      const updatedImage = images.find(
        (img) => img.imageId === selectedImage.imageId,
      );

      if (updatedImage) {
        setSelectedImage(updatedImage);
      }
    }
  }, [images]);

  /*
  ========================================
  Loading
  ========================================
  */

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-dark">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  /*
  ========================================
  Error
  ========================================
  */

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 text-light"
      style={{
        background: "linear-gradient(135deg, #0f172a, #111827, #050505)",
      }}
    >
      {/* HEADER */}
      <div
        className="d-flex justify-content-between align-items-center p-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* LEFT */}
        <div>
          <button
            className="btn btn-dark mb-3"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft />
          </button>

          <h2 className="fw-bold">{album?.name}</h2>

          <p className="text-secondary mb-0">{album?.description}</p>
        </div>

        {/* RIGHT */}
        <div className="d-flex flex-row me-3 gap-2">
          {isOwner && (
            <button
              className="btn btn-dark d-flex align-items-center gap-2 rounded-3"
              onClick={() => setShowShareModal(true)}
            >
              <Share />
              Share
            </button>
          )}
          {isOwner && (
            <button
              className="btn text-light d-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                border: "none",
                borderRadius: "12px",
              }}
              onClick={() => setShowUploadModal(true)}
            >
              <Upload />
              Upload Image
            </button>
          )}
        </div>
      </div>

      {/* IMAGES */}
      <div className="container-fluid p-4">
        {/* EMPTY STATE */}
        {images.length === 0 && (
          <div
            className="text-center py-5 rounded-4"
            style={{
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <h3>No Images Yet</h3>

            <p className="text-secondary">
              Upload your first image to this album.
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="row g-4">
          {images.map((image) => (
            <div className="col-md-6 col-lg-4 col-xl-3" key={image.imageId}>
              <div
                className="card border-0 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "24px",
                }}
                onClick={() => setSelectedImage(image)}
              >
                {/* IMAGE */}
                <img
                  src={image.imageUrl}
                  alt={image.name}
                  style={{
                    height: "240px",
                    objectFit: "cover",
                  }}
                />

                {/* BODY */}
                <div className="card-body text-light">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <h6>{image.name.slice(0, 20)}</h6>
                    {isOwner && (
                      <button
                        className="btn btn-sm"
                        disabled={deletingImageId === image.imageId}
                        style={{
                          background: "rgba(255, 2, 28, 0.7)",

                          border: "1px solid rgba(220,53,69,0.35)",

                          color: "#f5f2f2",

                          borderRadius: "5px",

                          minWidth: "90px",

                          transition: "0.25s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteImage(image.imageId);
                        }}
                      >
                        {deletingImageId === image.imageId ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    )}

                    {isOwner && (
                      <button
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "38px",
                          height: "38px",
                          background: image.isFavorite
                            ? "rgba(220,53,69,0.18)"
                            : "rgba(255,255,255,0.08)",

                          border: image.isFavorite
                            ? "1px solid rgba(220,53,69,0.4)"
                            : "1px solid rgba(255,255,255,0.12)",

                          transition: "0.25s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          toggleFavorite(image.imageId, image.isFavorite);
                        }}
                      >
                        {image.isFavorite ? (
                          <HeartFill size={18} color="#ff4d6d" />
                        ) : (
                          <Heart size={18} color="#ffffff" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* PERSON */}
                  {image.person && (
                    <div className="mt-2">
                      <small
                        className="px-2 py-1 rounded-pill"
                        style={{
                          background: "rgba(255,255,255,0.08)",

                          color: "#d1d5db",

                          fontSize: "12px",
                        }}
                      >
                        👤 {image.person}
                      </small>
                    </div>
                  )}

                  {/* TAGS */}
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {image.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="badge"
                        style={{
                          background: "rgba(246,172,92,0.18)",
                          color: "#f6ac5c",
                        }}
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
          ))}
        </div>
      </div>
      {showUploadModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 text-light"
              style={{
                background: "#111827",
                borderRadius: "24px",
              }}
            >
              {/* HEADER */}
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Upload Image</h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>

              {/* BODY */}
              <form onSubmit={handleUploadImage}>
                <div className="modal-body">
                  {/* IMAGE */}
                  <div className="mb-3">
                    <label className="form-label">Select Image</label>

                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleImageChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* TAGS */}
                  <div className="mb-3">
                    <label className="form-label">Tags</label>

                    <input
                      type="text"
                      name="tags"
                      value={imageData.tags}
                      onChange={handleImageChange}
                      placeholder="nature,travel"
                      className="form-control text-light border-0"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                      }}
                    />
                  </div>

                  {/* PERSON */}
                  <div className="mb-3">
                    <label className="form-label">Person</label>

                    <input
                      type="text"
                      name="person"
                      value={imageData.person}
                      onChange={handleImageChange}
                      placeholder="Tagged person"
                      className="form-control text-light border-0"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                      }}
                    />
                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn text-light"
                    style={{
                      background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                      border: "none",
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="modal d-block"
          onClick={() => setSelectedImage(null)}
          style={{
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div
              className="modal-content border-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#111827",
                borderRadius: "28px",
              }}
            >
              <div className="row g-0">
                {/* IMAGE */}
                <div className="col-lg-8">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.name}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      maxHeight: "85vh",
                    }}
                  />
                </div>

                {/* DETAILS */}
                <div className="col-lg-4 text-light">
                  <div className="p-4 d-flex flex-column h-100">
                    {/* HEADER */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <h4
                          className="fw-bold mb-1"
                          style={{
                            wordBreak: "break-word",
                            lineHeight: "1.4",
                          }}
                        >
                          {selectedImage.name}
                        </h4>

                        <small className="text-secondary">
                          {selectedImage.size} bytes
                        </small>
                      </div>

                      <button
                        className="btn-close btn-close-white"
                        onClick={() => setSelectedImage(null)}
                      ></button>
                    </div>

                    {/* PERSON */}
                    {selectedImage.person && (
                      <div className="mb-3">
                        <span
                          className="px-3 py-2 rounded-pill"
                          style={{
                            background: "rgba(255,255,255,0.08)",

                            color: "#e5e7eb",

                            fontSize: "14px",
                          }}
                        >
                          👤 {selectedImage.person}
                        </span>
                      </div>
                    )}

                    {/* TAGS */}
                    <div className="mb-4 d-flex flex-wrap gap-2">
                      {selectedImage.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="badge"
                          style={{
                            background: "rgba(246,172,92,0.18)",
                            color: "#f6ac5c",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="d-flex gap-2 mb-4">
                      {/* Favorite */}
                      {isOwner && (
                        <button
                          className="btn d-flex align-items-center justify-content-center"
                          style={{
                            width: "44px",
                            height: "44px",

                            background: selectedImage.isFavorite
                              ? "rgba(220,53,69,0.18)"
                              : "rgba(255,255,255,0.08)",

                            border: selectedImage.isFavorite
                              ? "1px solid rgba(220,53,69,0.4)"
                              : "1px solid rgba(255,255,255,0.12)",
                          }}
                          onClick={() =>
                            toggleFavorite(
                              selectedImage.imageId,
                              selectedImage.isFavorite,
                            )
                          }
                        >
                          {selectedImage.isFavorite ? (
                            <HeartFill size={20} color="#ff4d6d" />
                          ) : (
                            <Heart size={20} color="#ffffff" />
                          )}
                        </button>
                      )}

                      {/* Delete */}

                      {isOwner && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            handleDeleteImage(selectedImage.imageId);

                            setSelectedImage(null);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {/* COMMENTS */}
                    <div
                      className="flex-grow-1 overflow-auto"
                      style={{
                        maxHeight: "300px",
                      }}
                    >
                      <h6 className="fw-bold mb-3">Comments</h6>

                      {selectedImage.comments?.length === 0 && (
                        <p className="text-secondary small">No comments yet.</p>
                      )}

                      {selectedImage.comments?.map((comment, index) => (
                        <div
                          key={index}
                          className="mb-2 p-2 rounded"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                          }}
                        >
                          {comment}
                        </div>
                      ))}
                    </div>

                    {/* ADD COMMENT */}
                    <div className="mt-4 d-flex gap-2">
                      <input
                        type="text"
                        placeholder="Add comment..."
                        value={commentInputs[selectedImage.imageId] || ""}
                        onChange={(e) =>
                          handleCommentChange(
                            selectedImage.imageId,

                            e.target.value,
                          )
                        }
                        className="form-control text-light border-0"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                        }}
                      />

                      <button
                        className="btn text-light"
                        style={{
                          background:
                            "linear-gradient(135deg, #f6ac5c, #e4791b)",
                          border: "none",
                        }}
                        onClick={() => handleAddComment(selectedImage.imageId)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 text-light"
              style={{
                background: "#111827",
                borderRadius: "24px",
              }}
            >
              {/* HEADER */}
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Share Album</h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowShareModal(false)}
                ></button>
              </div>

              {/* BODY */}
              <div className="modal-body">
                <label className="form-label">User Email</label>

                <input
                  type="text"
                  value={shareEmails}
                  onChange={(e) => setShareEmails(e.target.value)}
                  placeholder="Enter email seperated by comas"
                  className="form-control text-light border-0"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              </div>

              {/* FOOTER */}
              <div className="modal-footer border-secondary">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn text-light"
                  style={{
                    background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                    border: "none",
                  }}
                  onClick={handleShareAlbum}
                >
                  {sharing ? "Sharing..." : "Share Album"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
