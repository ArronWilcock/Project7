import React, { useState, useEffect, useContext } from "react";
import { store } from "../../store";
import axios from "axios";
import "./Posts.scss";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const token = useContext(store).state.userInfo.token;

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        setPosts(data.posts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

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

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div className="post">
          <h2 className="post__author">
            {post.User.firstName} {post.User.lastName}
          </h2>
          <p className="post__caption">{post.caption}</p>
          <Link to={`/${post.id}`} key={post.id} className="post__tag">
            <div className="post__media--container">{renderMedia(post)}</div>
          </Link>
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
      ))}
    </div>
  );
}

export default PostList;
