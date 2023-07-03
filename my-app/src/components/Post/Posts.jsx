import React, { useState, useEffect } from 'react';
import "./Posts.scss"


function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    fetch('http://localhost:3000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      })
    
      .then(response => response.json())
      .then(data => setPosts(data.posts))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post">
          <h2 className="post__caption">{post.caption}</h2>
          <img src={post.imgUrl} alt="Post" className="post__image" />
          <div className="post__likes-container">
          <p className="post__likes">Likes: {post.likes}</p>
          <p className="post__dislikes">Dislikes: {post.dislikes}</p>
          </div>
          {/* Render other post details */}
        </div>
      ))}
    </div>
  );
}

export default PostList;
