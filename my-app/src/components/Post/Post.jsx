import React from 'react';

const Post = ({ post }) => {
  const { name, caption, gif, likes, dislikes } = post;

  return (
    <div className="post">
      <h2>{name}</h2>
      <p>{caption}</p>
      <img src={gif} alt="GIF" />
      <div className="post-details">
        <span>Likes: {likes}</span>
        <span>Dislikes: {dislikes}</span>
      </div>
    </div>
  );
};

export default Post;
