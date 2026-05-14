import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
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
    <div
      className="min-vh-100 text-light"
      style={{
        background: "linear-gradient(135deg, #0f172a, #111827, #050505)",
      }}
    >
      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg px-4 py-1"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="container-fluid">
          {/* Logo */}
          <h3
            className="fw-bold mb-0"
            style={{
              cursor: "pointer",
            }}
            onClick={() => setActiveSection("dashboard")}
          >
            <span style={{ color: "#f6ac5c" }}>Kavios</span>Pix
          </h3>

          {/* Search */}
          <div
            className="d-none d-md-flex align-items-center px-3 py-2 rounded-pill"
            style={{
              background: "rgba(255,255,255,0.08)",
              width: "350px",
            }}
          >
            <Search className="me-2 text-light opacity-75" />

            <input
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control bg-transparent border-0 text-light shadow-none"
            />
          </div>

          {/* Right */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn text-light d-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                border: "none",
                borderRadius: "12px",
              }}
              onClick={() => setShowModal(true)}
            >
              + Album
            </button>

            <button
              onClick={handleLogout}
              className="btn d-flex align-items-center gap-2 px-3 py-2 text-light"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                backdropFilter: "blur(10px)",
              }}
            >
              <BoxArrowRight size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="container-fluid">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-lg-2 d-none d-lg-block p-4">
            <div
              className="p-3 rounded-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                minHeight: "85vh",
              }}
            >
              <h6 className="text-uppercase text-secondary mb-4">Navigation</h6>

              <div className="d-flex flex-column gap-3">
                <button
                  className={`btn d-flex align-items-center gap-2 rounded-3 ${
                    activeSection === "dashboard"
                      ? "btn-warning text-dark fw-semibold"
                      : "btn-dark border-0 text-light"
                  }`}
                  onClick={() => setActiveSection("dashboard")}
                >
                  <GridFill />
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveSection("albums")}
                  className={`btn d-flex align-items-center gap-2 rounded-3 ${
                    activeSection === "albums"
                      ? "btn-warning text-dark fw-semibold"
                      : "btn-dark border-0 text-light"
                  }`}
                >
                  <Images />
                  My Albums
                </button>

                <button
                  onClick={() => setActiveSection("shared")}
                  className={`btn d-flex align-items-center gap-2 rounded-3 ${
                    activeSection === "shared"
                      ? "btn-warning text-dark fw-semibold"
                      : "btn-dark border-0 text-light"
                  }`}
                >
                  <ShareFill />
                  Shared Albums
                </button>

                <button
                  onClick={() => setActiveSection("myProfile")}
                  className={`btn d-flex align-items-center gap-2 rounded-3 ${
                    activeSection === "myProfile"
                      ? "btn-warning text-dark fw-semibold"
                      : "btn-dark border-0 text-light"
                  }`}
                >
                  👤 My Profile
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          {/* CONTENT */}
          <div className="col-lg-10 p-4">
            {/* ================= PROFILE SECTION ================= */}
            {activeSection === "myProfile" && (
              <div
                className="p-4 rounded-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                  {/* AVATAR */}
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                    style={{
                      width: "120px",
                      height: "120px",
                      fontSize: "42px",
                      background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                      color: "#111827",
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* USER INFO */}
                  <div>
                    <h2 className="fw-bold">{user.name}</h2>

                    <p className="text-secondary">{user.email}</p>

                    <div className="d-flex gap-3 flex-wrap mt-3">
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                        }}
                      >
                        <small className="text-secondary d-block">
                          My Albums
                        </small>

                        <h4 className="fw-bold mb-0">{myAlbums.length}</h4>
                      </div>

                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                        }}
                      >
                        <small className="text-secondary d-block">
                          Shared Albums
                        </small>

                        <h4 className="fw-bold mb-0">{sharedAlbums.length}</h4>
                      </div>

                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                        }}
                      >
                        <small className="text-secondary d-block">
                          Total Photos
                        </small>

                        <h4 className="fw-bold mb-0">{totalPhotos}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= NORMAL DASHBOARD ================= */}
            {activeSection !== "myProfile" && (
              <>
                {/* HERO */}
                <div
                  className="p-4 rounded-4 mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,172,92,0.2), rgba(228,121,27,0.12))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h2 className="fw-bold">Welcome back {user.name}</h2>

                  <p className="text-light opacity-75 mb-0">
                    Manage your albums, upload memories, and share moments
                    beautifully.
                  </p>
                </div>

                {/* STATS */}
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <div
                      className="p-4 rounded-4"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <h5>Total Albums</h5>

                      <h2 className="fw-bold">{displayedAlbums.length}</h2>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div
                      className="p-4 rounded-4"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <h5>Total Photos</h5>

                      <h2 className="fw-bold">{totalPhotos}</h2>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-warning"></div>
                  </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && displayedAlbums.length === 0 && (
                  <div
                    className="text-center py-5 rounded-4"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <h4>
                      {activeSection === "albums" && "No Albums Yet"}

                      {activeSection === "shared" && "No Shared Albums"}

                      {activeSection === "dashboard" && "No Albums Yet"}
                    </h4>

                    <p className="text-secondary">
                      Create your first album to start uploading memories.
                    </p>
                  </div>
                )}

                {/* ALBUM GRID */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0">
                    {activeSection === "albums" && "My Albums"}

                    {activeSection === "shared" && "Shared Albums"}

                    {activeSection === "dashboard" && "All Albums"}
                  </h3>
                </div>

                <div className="row g-4">
                  {displayedAlbums.map((album) => (
                    <div className="col-md-6 col-xl-3" key={album.albumId}>
                      <div
                        onClick={() => navigate(`/albums/${album.albumId}`)}
                        className="card border-0 text-light h-100"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: "24px",
                          overflow: "hidden",
                          backdropFilter: "blur(12px)",
                          transition: "0.3s ease",
                          cursor: "pointer",
                        }}
                      >
                        {/* COVER */}
                        <div
                          style={{
                            height: "180px",
                            background:
                              "linear-gradient(135deg, #f6ac5c, #e4791b)",
                          }}
                        ></div>

                        {/* BODY */}
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="fw-bold mb-0">{album.name}</h5>

                            {album.ownerId !== user.userId ? (
                              <span className="badge bg-info">
                                Shared With You
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                Owner
                              </span>
                            )}
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <p className="text-secondary mb-0">
                              {album.imageCount || 0} Photos
                            </p>

                            {album.ownerId === user.userId && (
                              <button
                                className="btn btn-sm btn-danger"
                                disabled={deletingAlbumId === album.albumId}
                                onClick={(e) =>
                                  handleDeleteAlbum(e, album.albumId)
                                }
                                style={{
                                  borderRadius: "10px",
                                }}
                              >
                                {deletingAlbumId === album.albumId
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CREATE ALBIM MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            background: "rgba(0,0,0,0.65)",
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
                <h5 className="modal-title fw-bold">Create New Album</h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* BODY */}
              <form onSubmit={handleCreateAlbum}>
                <div className="modal-body">
                  {/* Album Name */}
                  <div className="mb-3">
                    <label className="form-label">Album Name</label>

                    <input
                      type="text"
                      name="name"
                      value={albumData.name}
                      onChange={handleAlbumChange}
                      className="form-control text-light border-0"
                      placeholder="Enter album name"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                      }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>

                    <textarea
                      name="description"
                      value={albumData.description}
                      onChange={handleAlbumChange}
                      className="form-control text-light border-0"
                      rows="4"
                      placeholder="Write something..."
                      style={{
                        background: "rgba(255,255,255,0.06)",
                      }}
                    ></textarea>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
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
                    {creatingAlbum ? "Creating..." : "Create Album"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
