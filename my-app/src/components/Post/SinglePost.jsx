import React, { useState, useEffect, useContext } from "react";
import { store } from "../../store";
import axios from "axios";
import "./Posts.scss";
import { useParams } from "react-router-dom";

function SinglePost() {
  const [post, setPost] = useState(null);
  const token = useContext(store).state.userInfo.token;
  const userId = useContext(store).state.userInfo.userId;
  const { postId } = useParams();

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
        console.error("Error marking post as read:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        setPost(data);

        markPostAsRead();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postId, token]);

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

  return (
    <div className="post-list">
      {post && (
        <div className="post">
          <h2 className="post__author">
            {post.User.firstName} {post.User.lastName}
          </h2>
          <p className="post__caption">{post.caption}</p>
          <div className="post__media--container">{renderMedia(post)}</div>
          <div className="post__likes-container">
            <p className="post__likes">
              <i className="fa-solid fa-thumbs-up post__like"></i> {post.likes}
            </p>
            <p className="post__dislikes">
              <i className="fa-solid fa-thumbs-down post__dislike"></i>{" "}
              {post.dislikes}
            </p>
          </div>
          {/* Render other post details */}
        </div>
      )}
    </div>
  );
}

export default SinglePost;
