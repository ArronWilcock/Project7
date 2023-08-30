// Importing necessary modules and styles
import React, { useState, useContext } from "react"; // Importing React, useState, and useContext
import { store } from "../../store"; // Importing store from the application's store
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import axios from "axios"; // Importing axios for making HTTP requests
import "./CreatePostForm.scss";

function CreatePostForm() {
  // Setting up state variables using useState hook
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate(); // Getting navigate function from react-router-dom
  const { token, userId } = useContext(store).state.userInfo; // Getting token and userId from the global context store

  // Handling changes in the caption input
  const handleCaptionChange = (event) => {
    setCaption(event.target.value); // Update caption state
    updateFormCompletion();
  };

  // Handling changes in the media input
  const handleMediaChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    setMediaFile(selectedFile); // Update mediaFile state
    updateMediaPreview(selectedFile); // Update media preview
    updateFormCompletion();
  };

  // Updating media preview based on selected file type
  const updateMediaPreview = (selectedFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result); // Set the media preview
    };

    if (selectedFile.type.startsWith("image/")) {
      reader.readAsDataURL(selectedFile); // Read and set image preview
    } else if (selectedFile.type.startsWith("video/")) {
      reader.readAsDataURL(selectedFile); // Read and set video preview
    } else if (selectedFile.type.startsWith("audio/")) {
      reader.readAsDataURL(selectedFile); // Read and set audio preview
    }
  };

  // Updating the form completion status
  const updateFormCompletion = () => {
    setIsFormComplete(caption !== "" && mediaFile !== null); // Form is complete if caption and media are filled
  };

  // Handling form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Check if the user is authorized using the token from Redux store
      const post = JSON.stringify({ caption, userId });
      let response;
      if (mediaFile) {
        const formData = new FormData();
        formData.append("post", post);
        formData.append("media", mediaFile);

        // Sending a POST request to create a new post with media
        response = await axios.post(
          "http://localhost:3000/api/posts",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Sending a POST request to create a new post without media
        response = await axios.post("http://localhost:3000/api/posts", post, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      console.log("Post created:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Post not created:", error);
    }
  };

  // Rendering the create post form
  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <input
        aria-label="create post text field"
        className="create-post__caption"
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={handleCaptionChange}
      />

      <input
        aria-label="create post media input selector"
        className="create-post__upload"
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={handleMediaChange}
      />

      {mediaPreview && (
        <>
          {mediaFile.type.startsWith("image/") && (
            <img
              className="create-post__media-preview"
              src={mediaPreview}
              alt="Preview"
            />
          )}
          {mediaFile.type.startsWith("video/") && (
            <video controls className="create-post__media-preview">
              <source src={mediaPreview} type={mediaFile.type} />
            </video>
          )}
          {mediaFile.type.startsWith("audio/") && (
            <audio controls className="create-post__media-preview">
              <source src={mediaPreview} type={mediaFile.type} />
            </audio>
          )}
        </>
      )}

      <button
        className="create-post__submitbtn"
        type="submit"
        disabled={!isFormComplete}
      >
        Post
      </button>
    </form>
  );
}

export default CreatePostForm;
