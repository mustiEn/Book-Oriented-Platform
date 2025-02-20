import { Author } from "../Author.js";
import { AuthorBookAssociation } from "../AuthorBookAssociation.js";
import { BookCollection } from "../BookCollection.js";
import { BookReadingState } from "../BookReadingState.js";
import { Category } from "../Category.js";
import { CategoryBookAssociation } from "../CategoryBookAssociation.js";
import { BookDescription } from "../Description.js";
import { DescriptionBookAssociation } from "../DescriptionBookAssociation.js";
import { LikedBook } from "../LikedBook.js";
import { PrivateNote } from "../PrivateNote.js";
import { Publisher } from "../Publisher.js";
import { PublisherBookAssociation } from "../PublisherBookAssociation.js";
import { Quote } from "../Quote.js";
import { RatedBook } from "../RatedBook.js";
import { RecommendedBook } from "../RecommendedBook.js";
import { Review } from "../Review.js";
import { Thought } from "../Thought.js";
import { Topic } from "../Topic.js";

export const bookAssociations = () => {
  BookCollection.belongsToMany(Topic, { through: "topic_book_associations" });
  Topic.belongsToMany(BookCollection, { through: "topic_book_associations" });

  BookCollection.hasMany(Quote, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Quote.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  BookCollection.hasMany(Review, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  Review.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(Thought, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  Thought.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(PublisherBookAssociation, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  PublisherBookAssociation.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(AuthorBookAssociation, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  AuthorBookAssociation.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(CategoryBookAssociation, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  CategoryBookAssociation.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(DescriptionBookAssociation, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  DescriptionBookAssociation.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(BookReadingState, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  BookReadingState.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  BookCollection.hasMany(LikedBook, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  LikedBook.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  BookCollection.hasMany(PrivateNote, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PrivateNote.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  BookCollection.hasMany(RatedBook, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  RatedBook.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //  & OTHERS

  Publisher.hasMany(PublisherBookAssociation, {
    foreignKey: "publisherId",
    onDelete: "CASCADE",
  });
  PublisherBookAssociation.belongsTo(Publisher, {
    foreignKey: "publisherId",
    onDelete: "CASCADE",
  });

  Author.hasMany(AuthorBookAssociation, {
    foreignKey: "authorId",
    onDelete: "CASCADE",
  });
  AuthorBookAssociation.belongsTo(Author, {
    foreignKey: "authorId",
    onDelete: "CASCADE",
  });

  Category.hasMany(CategoryBookAssociation, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });
  CategoryBookAssociation.belongsTo(Category, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });

  BookDescription.hasMany(DescriptionBookAssociation, {
    foreignKey: "descriptionId",
    onDelete: "CASCADE",
  });
  DescriptionBookAssociation.belongsTo(BookDescription, {
    foreignKey: "descriptionId",
    onDelete: "CASCADE",
  });

  BookCollection.hasMany(RecommendedBook, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });
  RecommendedBook.belongsTo(BookCollection, {
    foreignKey: "bookId",
    onDelete: "CASCADE",
  });

  Category.hasMany(RecommendedBook, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });
  RecommendedBook.belongsTo(Category, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });
};
