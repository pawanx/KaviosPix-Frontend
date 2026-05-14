import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/dashboard.css"
import {
  BoxArrowRight,
  GridFill,
  HeartFill,
  Heart,
  Images,
  PlusCircleFill,
  Search,
  ShareFill,
} from "react-bootstrap-icons";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalFavorites: 0,
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");

  const [showModal, setShowModal] = useState(false);

  const [albumData, setAlbumData] = useState({
    name: "",
    description: "",
  });

  const [creatingAlbum, setCreatingAlbum] = useState(false);

  const [deletingAlbumId, setDeletingAlbumId] = useState(null);

  const [albums, setAlbums] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get("/albums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlbums(response.data.albums);
    } catch (error) {
      console.log(error);

      setError(error.response.data.message || "Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleAlbumChange = (e) => {
    setAlbumData({
      ...albumData,

      [e.target.name]: e.target.value,
    });
  };
  const handleCreateAlbum = async (e) => {
    e.preventDefault();

    try {
      setCreatingAlbum(true);

      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/albums",

        {
          name: albumData.name,

          description: albumData.description,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
    ========================================
    Refresh Albums
    ========================================
    */

      fetchAlbums();

      /*
    ========================================
    Reset Form
    ========================================
    */

      setAlbumData({
        name: "",
        description: "",
      });

      /*
    ========================================
    Close Modal
    ========================================
    */

      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingAlbum(false);
    }
  };

  const handleDeleteAlbum = async (e, albumId) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      setDeletingAlbumId(albumId);

      await axiosInstance.delete(
        `/albums/${albumId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
    ========================================
    Remove Deleted Album From State
    ========================================
    */

      setAlbums((prev) => prev.filter((album) => album.albumId !== albumId));
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to delete album");
    } finally {
      setDeletingAlbumId(null);
    }
  };

  const myAlbums = albums.filter((album) => album.ownerId === user.userId);

  const sharedAlbums = albums.filter(
    (album) =>
      album.ownerId !== user.userId && album.sharedUsers?.includes(user.email),
  );

  let displayedAlbums = [];

  if (activeSection === "albums") {
    displayedAlbums = myAlbums;
  } else if (activeSection === "shared") {
    displayedAlbums = sharedAlbums;
  } else {
    displayedAlbums = albums;
  }

  /*
========================================
SEARCH FILTER
========================================
*/

  displayedAlbums = displayedAlbums.filter((album) =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPhotos = displayedAlbums.reduce(
    (total, album) => total + (album.imageCount || 0),
    0,
  );

  useEffect(() => {
    fetchAlbums();
  }, []);
  return (
    <div className="dashboard-page">
  {/* NAVBAR */}
  <nav className="dashboard-navbar">
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Logo */}
        <h3
          className="dashboard-logo"
          onClick={() => setActiveSection("dashboard")}
        >
          <span>Kavios</span>Pix
        </h3>

        {/* Search */}
        <div className="dashboard-search d-none d-md-flex">
          <Search className="me-2 opacity-75" />

          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="create-album-btn"
            onClick={() => setShowModal(true)}
          >
            + Album
          </button>

          <button onClick={handleLogout} className="logout-btn">
            <BoxArrowRight size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  {/* MAIN */}
  <div className="container-fluid">
    <div className="row">
      {/* SIDEBAR */}
      <div className="col-lg-2 d-none d-lg-block p-4">
        <div className="dashboard-sidebar">
          <h6 className="sidebar-title">Navigation</h6>

          <div className="d-flex flex-column gap-3">
            <button
              className={`sidebar-btn ${
                activeSection === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <GridFill />
              Dashboard
            </button>

            <button
              onClick={() => setActiveSection("albums")}
              className={`sidebar-btn ${
                activeSection === "albums" ? "active" : ""
              }`}
            >
              <Images />
              My Albums
            </button>

            <button
              onClick={() => setActiveSection("shared")}
              className={`sidebar-btn ${
                activeSection === "shared" ? "active" : ""
              }`}
            >
              <ShareFill />
              Shared Albums
            </button>

            <button
              onClick={() => setActiveSection("myProfile")}
              className={`sidebar-btn ${
                activeSection === "myProfile" ? "active" : ""
              }`}
            >
              👤 My Profile
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="col-lg-10 p-4">

        
        {/* ================= PROFILE SECTION ================= */}

{activeSection === "myProfile" && (
  <div className="profile-card">
    <div className="d-flex flex-column flex-md-row align-items-center gap-4">
      
      {/* AVATAR */}
      <div className="profile-avatar">
        {user?.name?.charAt(0)?.toUpperCase()}
      </div>

      {/* USER INFO */}
      <div className="flex-grow-1">
        <h2 className="fw-bold mb-1">{user.name}</h2>

        <p className="text-secondary mb-4">
          {user.email}
        </p>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="profile-stats-card">
              <small>My Albums</small>

              <h4>{myAlbums.length}</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="profile-stats-card">
              <small>Shared Albums</small>

              <h4>{sharedAlbums.length}</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="profile-stats-card">
              <small>Total Photos</small>

              <h4>{totalPhotos}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        {activeSection !== "myProfile" && (
          <>
        {/* HERO */}
        <div className="hero-section">
          <div>
            <h1>Welcome back, {user.name}</h1>

            <p>
              Organize memories beautifully with KaviosPix.
            </p>
          </div>

          <div className="hero-glow"></div>
        </div>

        {/* STATS */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="stats-card">
              <p>Total Albums</p>

              <h2>{displayedAlbums.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stats-card">
              <p>Total Photos</p>

              <h2>{totalPhotos}</h2>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {!loading && displayedAlbums.length === 0 && (
          <div className="empty-state">
            <h4>No Albums Yet</h4>

            <p>Create your first album to start uploading memories.</p>
          </div>
        )}

        {/* GRID */}
        <div className="row g-4">
          {displayedAlbums.map((album) => (
            <div className="col-md-6 col-xl-3" key={album.albumId}>
              <div
                onClick={() => navigate(`/albums/${album.albumId}`)}
                className="album-card"
              >
                {/* COVER */}
                <div className="album-cover">
                  <div className="album-overlay"></div>

                  <div className="album-count">
                    {album.imageCount || 0} Photos
                  </div>
                </div>

                {/* BODY */}
                <div className="album-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>{album.name}</h5>

                    {album.ownerId !== user.userId ? (
                      <span className="badge bg-info">
                        Shared
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Owner
                      </span>
                    )}
                  </div>

                  <p className="album-description">
                    {album.description || "No description added yet."}
                  </p>

                  {album.ownerId === user.userId && (
                    <button
                      className="delete-btn"
                      disabled={deletingAlbumId === album.albumId}
                      onClick={(e) =>
                        handleDeleteAlbum(e, album.albumId)
                      }
                    >
                      {deletingAlbumId === album.albumId
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>)}
      </div>
    </div>
  </div>
</div>
  );
};

export default Dashboard;
