const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comment = sequelize.define("Comment", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });

    Comment.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Comment;
};
