// Importing necessary modules, components, and styles
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importing useNavigate for navigation and Link for linking to post details
import { store, actions } from "../../store"; // Importing store and actions from the application's store
import "./Account.scss";
import "../Post/Posts.scss";
import axios from "axios"; // Importing axios for making HTTP requests

function AccountPage() {
  // Setting up state variables using useState hook
  const [posts, setPosts] = useState([]); // Posts to display
  const [totalCommentCounts, setTotalCommentCounts] = useState({}); // Total comment counts for each post
  const [showSidebar, setShowSidebar] = useState(true); // Sidebar visibility
  const { dispatch } = useContext(store); // Using the dispatch function from the global context store
  const navigate = useNavigate(); // Using the useNavigate hook for navigation
  const userId = useContext(store).state.userInfo.userId; // Getting user ID from context
  const token = useContext(store).state.userInfo.token; // Getting user token from context
  const [refresh, setRefresh] = useState(false); // State for triggering data refresh

  // Function to show a specific main content container
  function showMainContainer(id) {
    // Hide all main content containers
    let mainContainers = document.getElementsByClassName("main-content");
    for (let i = 0; i < mainContainers.length; i++) {
      mainContainers[i].style.display = "none";
    }
    // Show the selected main content container
    let mainContainer = document.getElementById(id);
    mainContainer.style.display = "flex";
  }

  // Function to toggle the sidebar visibility
  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  // Handling logout
  const handleLogout = () => {
    // Display a confirmation dialog before proceeding
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Reset the user information in the store
      dispatch({ type: actions.SET_USER_INFO, value: null });
      dispatch({ type: actions.SET_LOGIN_STATE, value: false });

      // Navigate to the login page
      navigate("/login");
    }
  };

  // Handling account deletion
  const handleDeleteAccount = (event) => {
    event.preventDefault();

    // Display a confirmation dialog before proceeding
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:3000/api/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Account removed successfully:");
          dispatch({ type: actions.SET_LOGIN_STATE, value: true });
          navigate("/login"); // Navigate to the login page
        })
        .catch((error) => {
          // Handle account deletion error
          console.error("Account deletion error:", error);
        });
    } else {
      console.log("Account deletion was cancelled.");
    }
  };

  // Handling post deletion
  const handleDeletePost = (postId) => {
    // Display a confirmation dialog before proceeding
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your Post? This action cannot be undone."
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:3000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Post removed successfully:");
          setRefresh(!refresh); // Trigger data refresh
        })
        .catch((error) => {
          // Handle post deletion error
          console.error("Post deletion error:", error);
        });
    } else {
      console.log("Post deletion was cancelled.");
    }
  };

  useEffect(() => {
    // Fetch posts and comments
    axios
      .get(`http://localhost:3000/api/posts/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        const data = response.data;
        const postsWithComments = await Promise.all(
          data.posts.map(async (post) => {
            const commentResponse = await axios.get(
              `http://localhost:3000/api/posts/${post.id}/comments`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const comments = commentResponse.data.comments;
            const totalCommentCount = comments.length; // Calculate total comment count

            // Update the totalCommentCounts state
            setTotalCommentCounts((prevCounts) => ({
              ...prevCounts,
              [post.id]: totalCommentCount,
            }));

            return { ...post, comments };
          })
        );
        setPosts(postsWithComments);

        showMainContainer("myposts"); // Show the "myposts" main content container
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [userId, token, refresh]); // Effect runs when userId, token, or refresh changes

  // Function to render media content
  const renderMedia = (post) => {
    if (post.imgUrl) {
      if (post.imgUrl.endsWith(".mp3")) {
        return <audio src={post.imgUrl} controls className="post__media" />;
      } else if (post.imgUrl.endsWith(".mp4")) {
        return <video src={post.imgUrl} controls className="post__media" />;
      } else {
        return <img src={post.imgUrl} alt="Post" className="post__media" />;
      }
    } else {
      return null; // No media file, return null
    }
  };

  // Handling post like
  const handleLike = async (postId, usersLiked) => {
    // Checking if the current user has liked the post
    const isLiked = usersLiked.includes(userId.toString());
    const likeValue = isLiked ? 0 : 1;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/posts/${postId}/like/${userId}`,
        { like: likeValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: response.data.likes,
              usersLiked: response.data.usersLiked,
            }
          : post
      );

      setPosts(updatedPosts);
      setRefresh(!refresh); // Trigger data refresh
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handling post dislike
  const handleDislike = async (postId, usersDisliked) => {
    // Checking if the current user has disliked the post
    const isDisliked = usersDisliked.includes(userId.toString());
    const likeValue = isDisliked ? 0 : -1;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/posts/${postId}/like/${userId}`,
        { like: likeValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              dislikes: response.data.dislikes,
              usersDisliked: response.data.usersDisliked,
            }
          : post
      );

      setPosts(updatedPosts);
      setRefresh(!refresh); // Trigger data refresh
    } catch (error) {
      console.error(error.message);
    }
  };

  // Checking if the post is liked by the current user
  const isLikedByCurrentUser = (post) => {
    return post.usersLiked && post.usersLiked.includes(userId.toString());
  };

  // Checking if the post is disliked by the current user
  const isDislikedByCurrentUser = (post) => {
    return post.usersDisliked && post.usersDisliked.includes(userId.toString());
  };

  // Rendering the component's JSX
  return (
    <div className="account-page">
      {/* Mobile sidebar */}
      <div id="mobile-dropdown" className="sidebar">
        <button aria-label="sidebar toggle" onClick={toggleSidebar}>
          <i className="fa-solid fa-caret-down"></i>
        </button>
        <ul className={showSidebar ? "" : "hide"}>
          <li>
            <button
              aria-label="My posts link"
              onClick={() => showMainContainer("myposts")}
            >
              My Posts
            </button>
          </li>
          <li>
            <button
              aria-label="Delete account link"
              onClick={() => showMainContainer("delete-account")}
            >
              Delete Account
            </button>
          </li>
          <li>
            <button aria-label="Logout button" onClick={() => handleLogout()}>
              Logout
            </button>
          </li>
        </ul>
      </div>
      {/* Desktop sidebar */}
      <div id="desktop-sidebar" className="sidebar">
        <ul>
          <li>
            <button
              aria-label="My posts link"
              onClick={() => showMainContainer("myposts")}
            >
              My Posts
            </button>
          </li>
          <li>
            <button
              aria-label="Delete account link"
              onClick={() => showMainContainer("delete-account")}
            >
              Delete Account
            </button>
          </li>
          <li>
            <button aria-label="Logout button" onClick={() => handleLogout()}>
              Logout
            </button>
          </li>
        </ul>
      </div>
      {/* Main content */}
      <div className="main-container">
        {/* My Posts */}
        <div id="myposts" className="main-content">
          {/* Display message if user has no posts */}
          {posts.length === 0 ? (
            <div className="no-posts-message">
              <h1>User has no posts</h1>
            </div>
          ) : (
            // Display list of user's posts
            <div className="post-list">
              {posts.map((post) => (
                <div className="post" key={post.id}>
                  {/* Post header */}
                  <div className="post__header">
                    <h2 className="post__author">
                      {post.User.firstName} {post.User.lastName}
                    </h2>
                    <i
                      className="fa-solid fa-delete-left post__delete"
                      onClick={() => handleDeletePost(post.id)}
                    ></i>
                  </div>
                  {/* Link to post details */}
                  <Link to={`/${post.id}`} className="post__tag">
                    <p className="post__caption">{post.caption}</p>
                    <div className="post__media--container">
                      {renderMedia(post)} {/* Render media content */}
                    </div>
                  </Link>
                  {/* Post footer */}
                  <div className="post__footer">
                    {/* Likes, dislikes, and comments */}
                    <div className="post__likes-container">
                      <p className="post__likes">
                        <i
                          className={`fa-solid fa-thumbs-up ${
                            isLikedByCurrentUser(post)
                              ? "post__like--liked"
                              : "post__like"
                          }`}
                          onClick={() => handleLike(post.id, post.usersLiked)}
                        ></i>{" "}
                        {post.likes}
                      </p>
                      <p className="post__dislikes">
                        <i
                          className={`fa-solid fa-thumbs-down ${
                            isDislikedByCurrentUser(post)
                              ? "post__dislike--disliked"
                              : "post__dislike"
                          }`}
                          onClick={() =>
                            handleDislike(post.id, post.usersDisliked)
                          }
                        ></i>{" "}
                        {post.dislikes}
                      </p>
                      <Link to={`/${post.id}`}>
                        <p className="post__comments-count">
                          <i className="fa-regular fa-comment"></i>{" "}
                          {totalCommentCounts[post.id] || 0}
                        </p>
                      </Link>
                    </div>
                    {/* Read status */}
                    <div className="post__isRead-container">
                      {post.readByUsers.includes(userId) && (
                        <p className="post__isRead">
                          <i className="fa-brands fa-readme"></i>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div id="delete-account" className="main-content">
          <h2 className="delete-account__title">
            Are you sure you want to delete your account?
          </h2>
          <p className="delete-account__warning">
            All of your posts and comments will be permanently deleted
          </p>
          <button
            type="submit"
            className="delete-account__btn"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
