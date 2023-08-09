import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { store, actions } from "../../store";
import { Link } from "react-router-dom";
import "./Account.scss";
import "../Post/Posts.scss";
import axios from "axios";

function AccountPage() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [showSidebar, setShowSidebar] = useState(true);
  const { dispatch } = useContext(store);
  const navigate = useNavigate();
  const userId = useContext(store).state.userInfo.userId;
  const token = useContext(store).state.userInfo.token;
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
  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  const handleLogout = () => {
    // Perform any necessary cleanup or API requests for logout

    // Reset the user information in the store
    dispatch({ type: actions.SET_USER_INFO, value: null });
    dispatch({ type: actions.SET_LOGIN_STATE, value: false });

    // Navigate to the login or home page (whichever is appropriate for your app)
    navigate("/login"); // Replace "/login" with your desired route
  };

  const handleDeleteAccount = (event) => {
    event.preventDefault();

    axios
      .delete(`http://localhost:3000/api/auth/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Account removed successfully:");
        dispatch({ type: actions.SET_LOGIN_STATE, value: true });
        navigate("/login");
      })
      .catch((error) => {
        // Handle sign-in error
        console.error("Account deletion error:", error);
      });
  };

  useEffect(() => {
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
            return { ...post, comments };
          })
        );
        setPosts(postsWithComments);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [userId, token]);

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

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/posts/${postId}/comment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        {
          comment: newComment,
          userId: userId,
        }
      );
      if (response.status === 201) {
        // Refresh the post list to include the new comment
        // You might want to implement a more efficient way to update the state
        window.location.reload();
      }
    } catch (error) {
      console.error(error.error);
    }
  };

  return (
    <div className="account-page">
      <div className="sidebar">
        <button onClick={toggleSidebar}>
          <i className="fa-solid fa-caret-down"></i>
        </button>
        <ul className={showSidebar ? "" : "hide"}>
          <li>
            <button onClick={() => showMainContainer("myposts")}>
              My Posts
            </button>
          </li>
          <li>
            <button onClick={() => showMainContainer("delete-account")}>
              Delete Account
            </button>
          </li>
          <li>
            <button onClick={() => handleLogout()}>Logout</button>
          </li>
        </ul>
      </div>
      <div className="main-container">
        <div id="myposts" className="main-content">
          <div className="post-list">
            {posts.map((post) => (
              <div className="post" key={post.id}>
                <h2 className="post__author">
                  {post.User.firstName} {post.User.lastName}
                </h2>
                <Link to={`/${post.id}`} className="post__tag">
                  <p className="post__caption">{post.caption}</p>

                  <div className="post__media--container">
                    {renderMedia(post)}
                  </div>
                </Link>
                <div className="post__footer">
                  <div className="post__likes-container">
                    <p className="post__likes">
                      <i className="fa-solid fa-thumbs-up post__like"></i>{" "}
                      {post.likes}
                    </p>
                    <p className="post__dislikes">
                      <i className="fa-solid fa-thumbs-down post__dislike"></i>{" "}
                      {post.dislikes}
                    </p>
                  </div>
                  <div className="post__isRead-container">
                    {post.readByUsers.includes(userId) && (
                      <p className="post__isRead">
                        <i className="fa-brands fa-readme"></i>
                      </p>
                    )}
                  </div>
                </div>

                <div className="post__comments">
                  <div className="post__comment-form">
                    <input
                      className="post__comment-form--input"
                      placeholder="say what you're thinking ..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="post__comment-form--btn"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      Post
                    </button>
                  </div>
                  <h3>Comments:</h3>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <h2 className="comment__author">
                        {comment.User.firstName} {comment.User.lastName} says...
                      </h2>
                      <p className="comment__text">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
