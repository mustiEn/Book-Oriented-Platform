import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./layout/Layout";

// import AdminLayout from "./layout/AdminLayout.jsx";
// import Admin from "./views/Admin.jsx";

import ScrollToTop from "./components/ScrollToTop.jsx";
import * as Loader from "./loaders/index.js";

const Completion = lazy(() => import("./views/Completion.jsx"));
import Premium from "./views/Premium.jsx";
import ShareQuote from "./views/ShareQuote.jsx";
import ShareThought from "./views/ShareThought.jsx";
import ShareReview from "./views/ShareReview.jsx";
const Notifications = lazy(() => import("./views/Notifications.jsx"));

import ReaderProfile from "./views/ReaderProfile.jsx";
const ReaderProfileReviews = lazy(() =>
  import("./components/ReaderProfileReviews.jsx")
);
const ReaderProfileComments = lazy(() =>
  import("./components/ReaderProfileComments.jsx")
);
const ReaderProfileQuotes = lazy(() =>
  import("./components/ReaderProfileQuotes.jsx")
);
const ReaderProfileThoughts = lazy(() =>
  import("./components/ReaderProfileThoughts.jsx")
);
const ReaderProfileBookshelf = lazy(() =>
  import("./components/ReaderProfileBookshelf.jsx")
);
const ReaderPostComments = lazy(() =>
  import("./components/ReaderPostComments.jsx")
);
const BookshelfOverview = lazy(() => import("./components/BookshelfOverview"));
const BookshelfBooks = lazy(() => import("./components/BookshelfBooks"));

import BookDetails from "./views/BookDetails.jsx";
const BookDetailsAbout = lazy(() => import("./components/BookDetailsAbout"));
const BookDetailsReviews = lazy(() =>
  import("./components/BookDetailsReviews")
);
const BookDetailsReaders = lazy(() =>
  import("./components/BookDetailsReaders")
);
const BookDetailsStatistics = lazy(() =>
  import("./components/BookDetailsStatistics")
);

import ThemedTopics from "./views/ThemedTopics.jsx";
import CreateTopic from "./views/CreateTopic.jsx";
import Topic from "./views/Topic.jsx";
const TopicBooks = lazy(() => import("./components/TopicBooks.jsx"));
const TopicPosts = lazy(() => import("./components/TopicPosts.jsx"));
const TopicReaders = lazy(() => import("./components/TopicReaders.jsx"));

const Signup = lazy(() => import("./views/Signup"));
const Login = lazy(() => import("./views/Login"));
import Home from "./views/Home";
import Error from "./views/Error";
import NotFound from "./views/NotFound";

import Explore from "./views/Explore";
const ExploreBooks = lazy(() => import("./components/ExploreBooks"));
const ExploreTopics = lazy(() => import("./components/ExploreTopics"));
const ExploreReaders = lazy(() => import("./components/ExploreReaders"));
const ExploreGeneral = lazy(() => import("./components/ExploreGeneral"));

import BookCategories from "./views/BookCategories.jsx";
const BookCategory = lazy(() => import("./components/BookCategory"));
import BookCategoriesList from "./components/BookCategoriesList";

import Search from "./views/Search.jsx";
import { ClipLoader } from "react-spinners";

function App() {
  const router = createBrowserRouter([
    {
      path: "/return",
      element: (
        <Suspense
          fallback={
            <ClipLoader
              color="#cf7e05"
              className="position-fixed top-50 end-50 start-50"
            ></ClipLoader>
          }
        >
          <Completion />
        </Suspense>
      ),
    },
    {
      path: "/signup",
      element: (
        <Suspense
          fallback={
            <ClipLoader
              color="#cf7e05"
              className="position-fixed top-50 end-50 start-50"
            ></ClipLoader>
          }
        >
          <Signup />
        </Suspense>
      ),
    },
    {
      path: "/login",
      element: (
        <Suspense
          fallback={
            <ClipLoader
              color="#cf7e05"
              className="position-fixed top-50 end-50 start-50"
            ></ClipLoader>
          }
        >
          <Login />
        </Suspense>
      ),
    },
    // {
    //   path: "/admin",
    //   element: <AdminLayout />,
    //   children: [
    //     {
    //       index: true,
    //       element: <Admin />,
    //     },
    //   ],
    // },
    {
      element: (
        <>
          <ScrollToTop />
          <Layout />
        </>
      ),
      errorElement: <Error />,
      loader: Loader.loadInitials,
      children: [
        {
          errorElement: <Error />,
          children: [
            {
              path: "/home",
              element: <Home />,
              loader: Loader.loadHomePagePosts,
            },
            {
              path: "/search",
              element: <Search />,
              loader: Loader.loadSearch,
            },
            {
              path: "/premium",
              element: <Premium />,
            },
            {
              path: "/notifications",
              element: (
                <Suspense
                  fallback={
                    <ClipLoader
                      color="#cf7e05"
                      className="position-fixed top-50 end-50 start-50"
                    ></ClipLoader>
                  }
                >
                  <Notifications />
                </Suspense>
              ),
              loader: Loader.loadReaderNotifications,
            },
            {
              path: "/share-review",
              element: <ShareReview />,
              loader: Loader.loadBookDetailsForPost,
            },
            {
              path: "/share-quote",
              element: <ShareQuote />,
              loader: Loader.loadBookDetailsForPost,
            },
            {
              path: "/share-thought",
              element: <ShareThought />,
              loader: Loader.loadBookDetailsForPost,
            },
            {
              path: "/create-topic",
              element: <CreateTopic />,
              loader: Loader.loadCreateTopic,
            },
            {
              path: "/topic-category/:category",
              element: <ThemedTopics />,
              loader: Loader.loadThemedTopics,
            },
            {
              path: "/topic/:topicName",
              element: <Topic />,
              loader: Loader.loadTopic,
              children: [
                {
                  index: true,
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <TopicBooks />
                    </Suspense>
                  ),
                  loader: Loader.loadTopicBooks,
                },
                {
                  path: "posts",
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <TopicPosts />
                    </Suspense>
                  ),
                  loader: Loader.loadTopicPosts,
                },
                {
                  path: "readers",
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <TopicReaders />
                    </Suspense>
                  ),
                  loader: Loader.loadTopicReaders,
                },
              ],
            },
            {
              path: "/explore",
              element: <Explore />,
              children: [
                {
                  index: true,
                  element: <ExploreGeneral />,
                  loader: Loader.loadExploreGeneral,
                },
                {
                  path: "books",
                  element: <ExploreBooks />,
                  loader: Loader.loadExploreBooks,
                },
                {
                  path: "topics",
                  element: <ExploreTopics />,
                  loader: Loader.loadExploreTopics,
                },
                {
                  path: "readers",
                  element: <ExploreReaders />,
                  loader: Loader.loadExploreReaders,
                },
              ],
            },
            {
              path: "/profile/:profile",
              element: <ReaderProfile />,
              loader: Loader.loadReaderProfile,
              children: [
                {
                  index: true,
                  element: <ReaderProfileReviews />,
                  loader: Loader.loadReaderReviews,
                },
                {
                  path: "comments",
                  element: <ReaderProfileComments />,
                  loader: Loader.loadReaderComments,
                },
                {
                  path: "quotes",
                  element: <ReaderProfileQuotes />,
                  loader: Loader.loadReaderQuotes,
                },
                {
                  path: "thoughts",
                  element: <ReaderProfileThoughts />,
                  loader: Loader.loadReaderThoughts,
                },
                {
                  path: "bookshelf",
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <ReaderProfileBookshelf />
                    </Suspense>
                  ),
                  children: [
                    {
                      index: true,
                      element: <BookshelfOverview />,
                      loader: Loader.loadReaderBookshelfOverview,
                    },
                    {
                      path: "books",
                      element: <BookshelfBooks />,
                      loader: Loader.loadReaderBooks,
                    },
                  ],
                },
              ],
            },
            {
              path: "/posts/:postType/:postId",
              element: (
                <Suspense
                  fallback={
                    <ClipLoader
                      color="#cf7e05"
                      className="position-fixed top-50 end-50 start-50"
                    ></ClipLoader>
                  }
                >
                  <ReaderPostComments />
                </Suspense>
              ),
              loader: Loader.loadReaderPostComments,
            },
            {
              path: "/book-categories",
              element: <BookCategories />,
              children: [
                {
                  index: true,
                  element: <BookCategoriesList />,
                  loader: Loader.loadBookCategoriesList,
                },
                {
                  path: ":categoryId",
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <BookCategory />
                    </Suspense>
                  ),
                  loader: Loader.loadBookCategory,
                },
              ],
            },
            {
              path: "/book/:bookTitle/:bookId",
              element: <BookDetails />,
              loader: Loader.loadBookDetails,
              children: [
                {
                  index: true,
                  element: <BookDetailsAbout />,
                  loader: Loader.loadBookStatistics,
                },
                {
                  path: "reviews",
                  element: <BookDetailsReviews />,
                  loader: Loader.loadReviews,
                },
                {
                  path: "statistics",
                  element: <BookDetailsStatistics />,
                  loader: Loader.loadBookStatistics,
                },
                {
                  path: "readers",
                  element: <BookDetailsReaders />,
                  loader: Loader.loadReaderProfiles,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
