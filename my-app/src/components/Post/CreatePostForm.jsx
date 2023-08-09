import React, { useState, useContext } from "react";
import { store } from "../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePostForm.scss";

function CreatePostForm() {
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();
  const { token, userId } = useContext(store).state.userInfo;

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
    updateFormCompletion();
  };

  const handleMediaChange = (event) => {
    const selectedFile = event.target.files[0];
    setMediaFile(selectedFile);
    updateMediaPreview(selectedFile);
    updateFormCompletion();
  };

  const updateMediaPreview = (selectedFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };

    if (selectedFile.type.startsWith("image/")) {
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith("video/")) {
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith("audio/")) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const updateFormCompletion = () => {
    setIsFormComplete(caption !== "" && mediaFile !== null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Check if the user is authorized using the token from Redux store
      const post = JSON.stringify({ caption, userId });
      let response;
      // TODO check if user has uploaded file. If not don't use formData, use JSON
      if (mediaFile) {
        const formData = new FormData();
        formData.append("post", post);
        formData.append("media", mediaFile);

        response = await axios.post(
          "http://localhost:3000/api/posts",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
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
      <button className="create-post__submitbtn" type="submit">
        Post
      </button>
    </form>
  );
}

export default CreatePostForm;
