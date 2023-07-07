import React, { useState, useContext } from "react";
import { store } from "../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePostForm.scss";

function CreatePostForm() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();
  const token = useContext(store).state.userInfo.token;

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
    updateFormCompletion();
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    updateImagePreview(selectedImage);
    updateFormCompletion();
  };

  const updateImagePreview = (selectedImage) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const updateFormCompletion = () => {
    setIsFormComplete(caption !== "" && image !== null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Check if the user is authorized using the token from Redux store
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:3000/api/posts",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Post created:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Post not created:", error);
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <input
        className="create-post__caption"
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={handleCaptionChange}
      />
      <input
        className="create-post__upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imagePreview && (
        <img
          className="create-post__image-preview"
          src={imagePreview}
          alt="Preview"
        />
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
