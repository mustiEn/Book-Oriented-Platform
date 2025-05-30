import { BookReadingState } from "../BookReadingState.js";
import { Comment } from "../Comment.js";
import { LikedBook } from "../LikedBook.js";
import { Post } from "../Post.js";
import { PrivateNote } from "../PrivateNote.js";
import { Quote } from "../Quote.js";
import { RatedBook } from "../RatedBook.js";
import { Review } from "../Review.js";
import { Thought } from "../Thought.js";
import { User } from "../User.js";
import { Transaction } from "../Transaction.js";
import { Subscription } from "../Subscription.js";
import { RestrictedPost } from "../RestrictedPost.js";
import { RecommendedBook } from "../RecommendedBook.js";
import { Notification } from "../Notification.js";

export const userAssociations = () => {
  User.hasMany(Notification, {
    foreignKey: "receiverId",
    onDelete: "CASCADE",
  });
  Notification.belongsTo(User, {
    foreignKey: "receiverId",
    onDelete: "CASCADE",
  });

  User.hasMany(RecommendedBook, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  RecommendedBook.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(RestrictedPost, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  RestrictedPost.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(Transaction, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Transaction.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(Subscription, {
    foreignKey: "userId",
  });
  Subscription.belongsTo(User, {
    foreignKey: "userId",
  });

  User.hasMany(Review, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Review.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(Thought, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Thought.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(Quote, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Quote.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(Post, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(Post, {
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.belongsTo(User, {
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(BookReadingState, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  BookReadingState.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(LikedBook, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  LikedBook.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(PrivateNote, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PrivateNote.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(RatedBook, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  RatedBook.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(Comment, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(Comment, {
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.belongsTo(User, {
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
