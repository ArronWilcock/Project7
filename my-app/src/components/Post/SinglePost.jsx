import React, { useState, useEffect, useContext } from "react";
import { store } from "../../store";
import axios from "axios";
import "./Posts.scss";
import { useParams } from "react-router-dom";

function SinglePost() {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [totalCommentCounts, setTotalCommentCounts] = useState({});
  const token = useContext(store).state.userInfo.token;
  const userId = useContext(store).state.userInfo.userId;
  const { postId } = useParams();

  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
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
        setPost(postWithComments);
        markPostAsRead();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [token, postId, refresh]); // Make sure to include dependencies if needed

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

      // Update the post's likes and usersLiked
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likes,
        usersLiked: response.data.usersLiked,
      }));
      setRefresh(!refresh);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Adapted handleDislike function
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
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="post-list">
      {post && (
        <div className="post">
          <h2 className="post__author">
            {post.User.firstName} {post.User.lastName}
          </h2>
          <p className="post__caption">{post.caption}</p>
          <div className="post__media--container">{renderMedia(post)}</div>
          <div className="post__footer">
            <div className="post__likes-container">
              <p className="post__likes">
                <i
                  className="fa-solid fa-thumbs-up post__like"
                  onClick={() => handleLike(post.id, post.usersLiked)}
                ></i>{" "}
                {post.likes}
              </p>
              <p className="post__dislikes">
                <i
                  className="fa-solid fa-thumbs-down post__dislike"
                  onClick={() => handleDislike(post.id, post.usersDisliked)}
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
                <hr className="comment__line-break" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePost;
