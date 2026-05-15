import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useTheme } from "../context/ThemeContext";

import ImageCard from "../components/ImageCard.jsx";
import ImagePreviewModal from "../components/ImagePreviewModal";
import UploadModal from "../components/UploadModal";
import ShareModal from "../components/ShareModal";

import "../styles/albumDetails.css";

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

  const { darkMode } = useTheme();
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

  const [activeTab, setActiveTab] = useState("all");

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
      toast.success("Image uploaded successfully");

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

      toast.success(
        currentStatus ? "Removed from favorites" : "Added to favorites",
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update favorite");
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

      toast.success("Image deleted successfully");

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

      toast.success("Album shared successfully");

      setShareEmails("");

      setShowShareModal(false);

      fetchAlbumDetails();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to share album");
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
    <div className={`album-page ${darkMode ? "album-dark" : "album-light"}`}>
      {/* HEADER */}
      <div className="album-header">
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

      {/* PILLS */}
      <div className="d-flex justify-content-center mt-4">
        <div
          className="d-flex p-1"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: "50px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={() => setActiveTab("all")}
            className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
            style={{
              background:
                activeTab === "all"
                  ? "linear-gradient(135deg,#f6ac5c,#e4791b)"
                  : "transparent",
              color: activeTab === "all" ? "#fff" : "#aaa",
              border: "none",
              transition: "0.3s",
            }}
          >
            📸 All Images
            <span className="badge bg-dark">{images.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className="btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ms-2"
            style={{
              background:
                activeTab === "favorites"
                  ? "linear-gradient(135deg,#ff4d6d,#ff758f)"
                  : "transparent",
              color: activeTab === "favorites" ? "#fff" : "#aaa",
              border: "none",
              transition: "0.3s",
            }}
          >
            <HeartFill />
            Favorites
            <span className="badge bg-dark">
              {images.filter((img) => img.isFavorite).length}
            </span>
          </button>
        </div>
      </div>

      {/* IMAGES */}
      <div className="container-fluid p-4">
        {/* EMPTY STATE */}
        {images.length === 0 && images.length === 0 && (
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

        {activeTab === "favorites" &&
          images.filter((img) => img.isFavorite).length === 0 && (
            <div
              className="text-center py-5 rounded-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3 className="mt-3">No Favorite Images</h3>

              <p className="text-secondary mb-0">
                Mark images as favorites to see them here.
              </p>
            </div>
          )}

        {/* GRID */}
        <div className="row g-4">
          {(activeTab === "favorites"
            ? images.filter((img) => img.isFavorite)
            : images
          ).map((image) => (
            <ImageCard
              key={image.imageId}
              image={image}
              isOwner={isOwner}
              deletingImageId={deletingImageId}
              setSelectedImage={setSelectedImage}
              handleDeleteImage={handleDeleteImage}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
      <UploadModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        handleUploadImage={handleUploadImage}
        handleImageChange={handleImageChange}
        imageData={imageData}
        uploading={uploading}
      />

      <ImagePreviewModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isOwner={isOwner}
        toggleFavorite={toggleFavorite}
        handleDeleteImage={handleDeleteImage}
        commentInputs={commentInputs}
        handleCommentChange={handleCommentChange}
        handleAddComment={handleAddComment}
      />

      <ShareModal
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        shareEmails={shareEmails}
        setShareEmails={setShareEmails}
        handleShareAlbum={handleShareAlbum}
        sharing={sharing}
      />
    </div>
  );
};

export default AlbumDetails;
