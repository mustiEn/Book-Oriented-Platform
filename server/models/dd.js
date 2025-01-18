import { logger } from "../utils/constants.js";
import { User } from "./User.js";
import { BookCollection } from "./BookCollection.js";
import fs from "fs";
import { Author } from "./Author.js";
import { BookDescription } from "./Description.js";
import { Publisher } from "./Publisher.js";
import { Category } from "./Category.js";
import { where } from "sequelize";

export const fetchApi = async () => {
  try {
    let loopCount = 0;
    let offs = 54;
    const bookFile = JSON.parse(
      fs.readFileSync("/www/Expressjs-Work/Books/server/models/books.json")
    );

    // setInterval(async () => {
    //   const books = await BookCollection.findAll({
    //     attributes: ["id", "book_key"],
    //     order: [["id", "ASC"]],
    //     offset: offs,
    //     limit: 100,
    //   });
    //   offs = offs + 100;
    //   for (let element of books) {
    //     element = element.toJSON();
    //     //   logger.log(element.id);
    //     const book = await Publisher.findOne({
    //       where: {
    //         bookId: element.id,
    //       },
    //     });
    //     if (book) {
    //       logger.log("book null", element);
    //       for (let i = 0; i < bookFile.length; i++) {
    //         const row = bookFile[i].items;
    //         // logger.log("loop file ==>", i);
    //         for (const x of row) {
    //           let flag = false;
    //           if (x.id == element.book_key) {
    //             logger.log("book found", x.id, x.volumeInfo.publisher);
    //             // const desc = x.volumeInfo.description
    //             //   ? x.volumeInfo.description
    //             //   : null;
    //             const publisher = x.volumeInfo.publisher
    //               ? x.volumeInfo.publisher
    //               : null;

    //             // await Publisher.create({
    //             //   publisher: publisher,
    //             //   bookId: element.id,
    //             // });

    //             // await BookDescription.create({
    //             //   description: desc,
    //             //   bookId: element.id,
    //             // });

    //             // if (x.volumeInfo.categories) {
    //             //   for (const c of x.volumeInfo.categories) {
    //             //     await Category.create({
    //             //       category: c,
    //             //       bookId: element.id,
    //             //     });
    //             //   }
    //             // } else {
    //             //   await Category.create({
    //             //     category: null,
    //             //     bookId: element.id,
    //             //   });
    //             // }

    //             // if (x.volumeInfo.authors) {
    //             //   for (const a of x.volumeInfo.authors) {
    //             //     const aa = await Author.create({
    //             //       author: a,
    //             //       bookId: element.id,
    //             //     });
    //             //     // logger.log("author created", aa);
    //             //   }
    //             flag = true;
    //             // } else {
    //             //   const aa = await Author.create({
    //             //     author: null,
    //             //     bookId: element.id,
    //             //   });
    //             //   //   logger.log("author created", aa);
    //             //   flag = true;
    //             // }
    //             if (flag) break;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }, 2000);
    // setInterval(async () => {
    //   const row = bookFile[loopCount].items;

    //   for (const element of row) {
    //     const bookId = element.id;
    //     logger.log("book ID IN ROW ==>,", bookId);
    //     const book = await BookCollection.findOne({
    //       where: {
    //         book_key: element.id,
    //       },
    //     });

    //     if (!book) {
    //       logger.log("book ID IS NULL ==>,", bookId);
    //       //   const desc = element.volumeInfo.description
    //       //     ? element.volumeInfo.description
    //       //     : null;
    //       //   const publisher = element.volumeInfo.publisher
    //       //     ? element.volumeInfo.publisher
    //       //     : null;

    //       const bookItem = await BookCollection.create({
    //         book_key: bookId,
    //         title: element.volumeInfo.title,
    //         published_date: element.volumeInfo.publishedDate
    //           ? element.volumeInfo.publishedDate
    //           : null,
    //         page_count: element.volumeInfo.pageCount
    //           ? element.volumeInfo.pageCount
    //           : null,
    //         thumbnail: element.volumeInfo.imageLinks
    //           ? element.volumeInfo.imageLinks.thumbnail
    //           : null,
    //         buy_link: element.saleInfo.saleability.buyLink
    //           ? element.saleInfo.saleability.buyLink
    //           : null,
    //         language: element.volumeInfo.language,
    //         country: element.saleInfo.country,
    //         pdf: element.accessInfo.pdf
    //           ? element.accessInfo.pdf.acsTokenLink
    //           : null,
    //       });
    //       //   if (element.volumeInfo.authors) {
    //       //     for (const a of element.volumeInfo.authors) {
    //       //       await Author.create({
    //       //         author: a,
    //       //         bookId: bookItem.id,
    //       //       });
    //       //     }
    //       //   } else {
    //       //     await Author.create({
    //       //       author: null,
    //       //       bookId: bookItem.id,
    //       //     });
    //       //   }

    //       //   if (element.volumeInfo.categories) {
    //       //     for (const c of element.volumeInfo.categories) {
    //       //       await Category.create({
    //       //         category: c,
    //       //         bookId: bookItem.id,
    //       //       });
    //       //     }
    //       //   } else {
    //       //     await Category.create({
    //       //       category: null,
    //       //       bookId: bookItem.id,
    //       //     });
    //       //   }

    //       //   await BookDescription.create({
    //       //     desc,
    //       //     bookId: bookItem.id,
    //       //   });

    //       //   await Publisher.create({
    //       //     publisher,
    //       //     bookId: bookItem.id,
    //       //   });
    //       logger.log("NULL ID created =>>", element.id);
    //     }
    //   }
    //   logger.log("item length =>>", row.length);
    //   logger.log("loop count ==>", loopCount);
    //   loopCount++;
    // }, 2000);

    setInterval(async () => {
      const books = await BookCollection.findAll({
        attributes: ["id", "book_key"],
        order: [["id", "ASC"]],
        offset: offs,
        limit: 10,
      });
      offs = offs + 10;
      let i = 0;
      setInterval(async () => {
        if (i < books.length) {
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${books[i].book_key}`
          );
          const data = await res.json();
          logger.log(res.status);
          logger.log("loop count ==>", i);
          logger.log("item id =>>", books[i].toJSON().id);
          logger.log("array length =>>", books.length);
          const au = await Publisher.findOne({
            where: {
              bookId: books[i].id,
            },
          });
          let publisher;
          if (!au) {
            if (
              data.volumeInfo.publisher != undefined &&
              data.volumeInfo.publisher != ""
            ) {
              logger.log(data.volumeInfo.publisher);
              publisher = data.volumeInfo.publisher.split(", ");
              logger.log(publisher);
              if (publisher.length > 1) {
                for (const x of publisher) {
                  await Publisher.create({
                    publisher: x,
                    bookId: books[i].id,
                  });
                }
              } else {
                for (const x of publisher) {
                  await Publisher.create({
                    publisher: x,
                    bookId: books[i].id,
                  });
                }
              }
            } else {
              ("");
            }
          }
          i++;
        }
      }, 1000);
    }, 10000);
  } catch (error) {
    logger.log(error);
  }
};

export const fetch2 = async () => {
  try {
    let loopCount = 0;
    let offs = 3193;
    const bookFile = JSON.parse(
      fs.readFileSync("/www/Expressjs-Work/Books/server/models/books.json")
    );

    setInterval(async () => {
      const books = await BookCollection.findAll({
        attributes: ["id", "book_key"],
        order: [["id", "ASC"]],
        offset: offs,
        limit: 10,
      });
      offs = offs + 10;
      let i = 0;
      setInterval(async () => {
        if (i < books.length) {
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${books[i].book_key}`
          );
          const data = await res.json();
          logger.log(res.status);
          logger.log("loop count ==>", i);
          logger.log("item id =>>", books[i].toJSON().id, books[i].book_key);
          logger.log("array length =>>", books.length);

          const au = await Category.findOne({
            where: {
              bookId: books[i].id,
            },
          });
          if (au) {
            if (
              data.volumeInfo.categories != undefined &&
              data.volumeInfo.categories != ""
            ) {
              logger.log("data =>>", data.volumeInfo.categories);
              for (const a of data.volumeInfo.categories) {
                await Category.update(
                  {
                    category: a,
                  },
                  {
                    where: {
                      bookId: books[i].id,
                    },
                  }
                );
              }
            } else {
              await Category.update(
                {
                  category: null,
                },
                {
                  where: {
                    bookId: books[i].id,
                  },
                }
              );
            }
          }
          i++;
        }
      }, 400);
    }, 5000);
  } catch (error) {
    logger.log(error);
  }
};
