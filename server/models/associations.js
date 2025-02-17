import { Review } from "./Review.js";
import { Topic } from "./Topic.js";
import { Quote } from "./Quote.js";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { TopicCategory } from "./TopicCategory.js";
import { Thought } from "./Thought.js";
import { ThoughtImage } from "./ThoughtImage.js";
import { bookAssociations } from "./associations/bookAssociations.js";
import { userAssociations } from "./associations/userAssociations.js";
import { User } from "./User.js";
import { RestrictedPost } from "./RestrictedPost.js";

export function setupAssociations() {
  bookAssociations();
  userAssociations();

  // *OTHERS

  Topic.belongsToMany(User, { through: "user_topic_association" });
  User.belongsToMany(Topic, { through: "user_topic_association" });

  Topic.belongsToMany(TopicCategory, { through: "topic_category_association" });
  TopicCategory.belongsToMany(Topic, { through: "topic_category_association" });

  Topic.hasMany(Review, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Review.belongsTo(Topic, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Topic.hasMany(Thought, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Thought.belongsTo(Topic, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Thought.hasMany(ThoughtImage, {
    foreignKey: "thoughtId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ThoughtImage.belongsTo(Thought, {
    foreignKey: "thoughtId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Topic.hasMany(Quote, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Quote.belongsTo(Topic, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //& Posts and Users

  Post.hasOne(RestrictedPost, {
    foreignKey: "postId",
    onDelete: "CASCADE",
  });
  RestrictedPost.belongsTo(Post, {
    foreignKey: "postId",
    onDelete: "CASCADE",
  });

  Post.hasMany(Comment, {
    foreignKey: "commentToId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.belongsTo(Post, {
    foreignKey: "commentToId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Post.hasMany(Comment, {
    foreignKey: "rootParentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.belongsTo(Post, {
    foreignKey: "rootParentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Topic.hasMany(Post, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.belongsTo(Topic, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}
