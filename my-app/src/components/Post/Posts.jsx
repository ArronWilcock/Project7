// Importing necessary modules and styles
import React, { useState, useEffect, useContext } from "react"; // Importing React, useState, useEffect, and useContext
import { store } from "../../store"; // Importing store from the application's store
import axios from "axios"; // Importing axios for making HTTP requests
import "./Posts.scss";
import { Link } from "react-router-dom"; // Importing Link from react-router-dom

// Defining the PostList component
function PostList() {
  // Setting up state variables using useState hook
  const [posts, setPosts] = useState([]); // State for storing posts
  const [totalCommentCounts, setTotalCommentCounts] = useState({}); // State for storing total comment counts

  const [refresh, setRefresh] = useState(false); // State for refreshing the posts

  // Getting token and userId from the global context store
  const token = useContext(store).state.userInfo.token;
  const userId = useContext(store).state.userInfo.userId;

  // Fetching posts and comments on component mount and when refresh state changes
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        const data = response.data;

        // Fetching comments for each post in parallel using Promise.all
        const postsWithComments = await Promise.all(
          data.posts.map(async (post) => {
            const commentResponse = await axios.get(
              `http://localhost:3000/api/posts/${post.id}/comments`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const comments = commentResponse.data.comments;

            // Calculate the total count of comment strings for this post
            const totalCommentCount = comments.length;

            // Update the totalCommentCounts state
            setTotalCommentCounts((prevCounts) => ({
              ...prevCounts,
              [post.id]: totalCommentCount,
            }));

            return { ...post, comments };
          })
        );

        setPosts(postsWithComments); // Update the posts state with comments
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [token, refresh]);

  // Rendering media based on the type of content (image, video, audio)
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

      // Updating posts state and refreshing
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: response.data.likes,
              usersLiked: response.data.usersLiked,
            }
          : post
      );

      setPosts(updatedPosts); // Update the posts state
      setRefresh(!refresh); // Toggle the refresh state
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handling dislike for a post
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

      // Updating posts state and refreshing
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              dislikes: response.data.dislikes,
              usersDisliked: response.data.usersDisliked,
            }
          : post
      );

      setPosts(updatedPosts); // Update the posts state
      setRefresh(!refresh); // Toggle the refresh state
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

  // Rendering the list of posts
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h2 className="post__author">
            {post.User.firstName} {post.User.lastName}
          </h2>
          <Link to={`/${post.id}`} className="post__tag">
            <p className="post__caption">{post.caption}</p>
            <div className="post__media--container">{renderMedia(post)}</div>
          </Link>
          <div className="post__footer">
            <div className="post__likes-container">
              {/* Like button */}
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

              {/* Dislike button */}
              <p className="post__dislikes">
                <i
                  className={`fa-solid fa-thumbs-down ${
                    isDislikedByCurrentUser(post)
                      ? "post__dislike--disliked"
                      : "post__dislike"
                  }`}
                  onClick={() => handleDislike(post.id, post.usersDisliked)}
                ></i>{" "}
                {post.dislikes}
              </p>

              {/* Link to view comments */}
              <Link to={`/${post.id}`} className="post__comments-count">
                <p className="post__comments-count">
                  <i className="fa-regular fa-comment"></i>{" "}
                  {totalCommentCounts[post.id] || 0}
                </p>
              </Link>
            </div>
            {/* Indicator if the post has been read by the user */}
            <div className="post__isRead-container">
              {post.readByUsers.includes(`${userId}`) && (
                <span
                  className="post__isRead"
                  role="checkbox"
                  aria-checked={post.readByUsers.includes(userId.toString())}
                  aria-label="Read by user"
                >
                  <i className="fa-solid fa-eye" aria-hidden="true"></i>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
