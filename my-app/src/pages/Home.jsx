import React from "react";
import Banner from "../components/Banner/Banner";
import CreatePostForm from "../components/Post/CreatePostForm";
import Posts from "../components/Post/Posts";

function HomePage() {
  return (
    <div>
      <Banner />
      <Posts />
    </div>
  );
}

export default HomePage;
