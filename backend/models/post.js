const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define("Post", {
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usersLiked: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    usersDisliked: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  });

  return Post;
};
