import React, { useState, useEffect, useContext } from "react";
import { store } from "../../store";
import axios from "axios";
import "./Posts.scss";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [totalCommentCounts, setTotalCommentCounts] = useState({});

  const [refresh, setRefresh] = useState(false);

  const token = useContext(store).state.userInfo.token;
  const userId = useContext(store).state.userInfo.userId;

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/posts", {
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

        setPosts(postsWithComments);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [token, refresh]);

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
  const handleLike = async (postId, usersLiked) => {
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
      setRefresh(!refresh);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleDislike = async (postId, usersDisliked) => {
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
      setRefresh(!refresh);
    } catch (error) {
      console.error(error.message);
    }
  };

  const isLikedByCurrentUser = (post) => {
    return post.usersLiked && post.usersLiked.includes(userId.toString());
  };
  const isDislikedByCurrentUser = (post) => {
    return post.usersDisliked && post.usersDisliked.includes(userId.toString());
  };

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
                  onClick={() => handleDislike(post.id, post.usersDisliked)}
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
            <div className="post__isRead-container">
              {post.readByUsers.includes(`${userId}`) && (
                <i
                  className="fa-solid fa-eye post__isRead"
                  aria-label="Read by user"
                ></i>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
