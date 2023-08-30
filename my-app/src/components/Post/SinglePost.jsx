// Importing necessary modules and styles
import React, { useState, useEffect, useContext } from "react"; // Importing React, useState, useEffect, and useContext
import { store } from "../../store"; // Importing store from the application's store
import axios from "axios"; // Importing axios for making HTTP requests
import "./Posts.scss";
import { useParams, useNavigate } from "react-router-dom"; // Importing useParams and useNavigate from react-router-dom

function SinglePost() {
  // Setting up state variables using useState hook
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [totalCommentCounts, setTotalCommentCounts] = useState({});
  const token = useContext(store).state.userInfo.token; // Getting token from the global context store
  const userId = useContext(store).state.userInfo.userId; // Getting userId from the global context store
  const { postId } = useParams(); // Getting postId from the URL parameters
  const nav = useNavigate();

  const [refresh, setRefresh] = useState(false); // State for refreshing the component

  useEffect(() => {
    // Function to mark the post as read
    const markPostAsRead = () => {
      axios
        .post(
          `http://localhost:3000/api/posts/${postId}/mark-read/${userId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("Post marked as read");
        })
        .catch((error) => {
          if (error.response.status !== 409) {
            console.error("Error marking post as read:", error);
          }
        });
    };
    // Fetching the single post and its comments
    axios
      .get(`http://localhost:3000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        const data = response.data;
        const commentsResponse = await axios.get(
          `http://localhost:3000/api/posts/${postId}/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const comments = commentsResponse.data.comments;
        const postWithComments = { ...data, comments };
        const totalCommentCount = comments.length;

        // Update the totalCommentCounts state
        setTotalCommentCounts((prevCounts) => ({
          ...prevCounts,
          [postId]: totalCommentCount,
        }));
        setPost(postWithComments); // Update the post state
        markPostAsRead();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [token, postId, userId, refresh]); // Use effect dependencies

  // Rendering media based on the type of content (image, video, audio)
  const renderMedia = (post) => {
    if (post && post.imgUrl) {
      if (post.imgUrl.endsWith(".mp3")) {
        return <audio src={post.imgUrl} controls className="post__media" />;
      } else if (post.imgUrl.endsWith(".mp4")) {
        return <video src={post.imgUrl} controls className="post__media" />;
      } else {
        return <img src={post.imgUrl} alt="Post" className="post__media" />;
      }
    } else {
      return null; // No media file or post, return null
    }
  };

  // Handling like for a post
  const handleLike = async (postId, usersLiked) => {
    const isLiked = usersLiked.includes(userId.toString());
    const likeValue = isLiked ? 0 : 1;
    try {
      // Sending a POST request to like or unlike a post
      const response = await axios.post(
        `http://localhost:3000/api/posts/${postId}/like/${userId}`,
        { like: likeValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);

      // Update the post's likes and usersLiked
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likes,
        usersLiked: response.data.usersLiked,
      }));
      setRefresh(!refresh); // Toggle the refresh state
    } catch (error) {
      console.error(error.message);
    }
  };

  // Adapted handleDislike function
  const handleDislike = async (postId, usersDisliked) => {
    const isDisliked = usersDisliked.includes(userId.toString());
    const likeValue = isDisliked ? 0 : -1;
    try {
      // Sending a POST request to dislike or undislike a post
      const response = await axios.post(
        `http://localhost:3000/api/posts/${postId}/like/${userId}`,
        { like: likeValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);

      // Update the post's dislikes and usersDisliked
      setPost((prevPost) => ({
        ...prevPost,
        dislikes: response.data.dislikes,
        usersDisliked: response.data.usersDisliked,
      }));
      setRefresh(!refresh);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handling comment submission
  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/posts/${postId}/comment`,
        {
          comment: newComment,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        setNewComment("");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handling comment deletion
  const handleDeleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3000/api/posts/${commentId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Comment removed successfully:");
        setRefresh(!refresh);
      })
      .catch((error) => {
        // Handle comment deletion error
        console.error("Comment deletion error:", error);
      });
  };

  // Checking if the post is liked by the current user
  const isLikedByCurrentUser = (post) => {
    return post.usersLiked && post.usersLiked.includes(userId.toString());
  };

  // Checking if the post is disliked by the current user
  const isDislikedByCurrentUser = (post) => {
    return post.usersDisliked && post.usersDisliked.includes(userId.toString());
  };

  // Rendering the component
  return (
    <div className="post-list">
      {post && (
        <div className="post">
          <div className="post__header">
            <h2 className="post__author">
              {post.User.firstName} {post.User.lastName}
            </h2>
            <i
              className="fa-solid fa-arrow-rotate-left post__back-btn"
              onClick={() => nav(-1)} // Navigating back
              aria-label="Return to previous page"
            ></i>
          </div>
          <p className="post__caption">{post.caption}</p>
          <div className="post__media--container">{renderMedia(post)}</div>
          <div className="post__footer">
            <div className="post__likes-container">
              <p className="post__likes">
                <i
                  className={`fa-solid fa-thumbs-up ${
                    isLikedByCurrentUser(post)
                      ? "post__like--liked"
                      : "post__like"
                  }`}
                  onClick={() => handleLike(post.id, post.usersLiked)}
                  aria-label="like this post"
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
                  onClick={() => handleDislike(post.id, post.usersDisliked)}
                  aria-label="dislike this post"
                ></i>{" "}
                {post.dislikes}
              </p>
              <p className="post__comments-count">
                <i className="fa-regular fa-comment"></i>{" "}
                {totalCommentCounts[post.id] || 0}
              </p>
            </div>
          </div>
          <div className="post__comments">
            {/* Comment submission form */}
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
            {/* Mapping through and displaying comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment__header">
                  <h2 className="comment__author">
                    {comment.User.firstName} {comment.User.lastName} says...
                  </h2>
                  {userId === comment.UserId && (
                    <i
                      className="fa-solid fa-trash comment__remove"
                      onClick={() => handleDeleteComment(comment.id)}
                    ></i>
                  )}
                </div>
                <p className="comment__text">{comment.comment}</p>
                <hr className="comment__line-break" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePost; // Exporting the SinglePost component
