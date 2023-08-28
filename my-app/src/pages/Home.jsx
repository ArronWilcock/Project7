import React from "react";
import Banner from "../components/Banner/Banner";
import Posts from "../components/Post/Posts";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

function HomePage() {
  return (
    <div>
      <Banner />
      <LoadingSpinner />
      <Posts />
    </div>
  );
}

export default HomePage;
