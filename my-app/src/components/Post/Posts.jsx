import React, { useState, useEffect } from 'react';


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
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.caption}</h2>
          <img src={post.imgUrl} alt="Post" />
          <p>Likes: {post.likes}</p>
          <p>Dislikes: {post.dislikes}</p>
          {/* Render other post details */}
        </div>
      ))}
    </div>
  );
}

export default PostList;
