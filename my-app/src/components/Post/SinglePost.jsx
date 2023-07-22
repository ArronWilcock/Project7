import React, { useState, useEffect, useContext } from "react";
import { store } from "../../store";
import axios from "axios"
import "./Posts.scss";
import { useParams } from "react-router-dom";

function SinglePost() {
  const [post, setPost] = useState(null);
  const token = useContext(store).state.userInfo.token;
  const { postId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const data = response.data;
        setPost(data);
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
          <h2 className="post__caption">{post.caption}</h2>
          {renderMedia(post)}
          <div className="post__likes-container">
            <p className="post__likes">
              <i className="fa-solid fa-thumbs-up"></i> {post.likes}
            </p>
            <p className="post__dislikes">
              <i className="fa-solid fa-thumbs-down"></i> {post.dislikes}
            </p>
          </div>
          {/* Render other post details */}
        </div>
      )}
    </div>
  );
}

export default SinglePost;
