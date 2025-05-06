import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

// import Signup from "./views/Signup";
import Layout from "./layout/Layout";
// import Home from "./views/Home";
// const Home = lazy(() => import("./views/Home"));
// import Search from "./views/Search";

// import BookDetails from "./views/BookDetails";
// import BookDetailsAbout from "./components/BookDetailsAbout";
// import BookDetailsReviews from "./components/BookDetailsReviews";
// import BookDetailsReaders, {
//   loadReaderProfiles,
// } from "./components/BookDetailsReaders";
// import BookDetailsStatistics from "./components/BookDetailsStatistics";

// import ShareReview from "./views/ShareReview";
import Error from "./views/Error";
// import Login from "./views/Login";
import NotFound from "./views/NotFound";

// import ReaderProfile from "./views/ReaderProfile";
// import ReaderProfileBookshelf from "./components/ReaderProfileBookshelf";
// import ReaderProfileReviews from "./components/ReaderProfileReviews";
// import ReaderPostComments from "./components/ReaderPostComments";
// import ReaderProfileComments from "./components/ReaderProfileComments";
// import ReaderProfileQuotes from "./components/ReaderProfileQuotes";
// import ReaderProfileThoughts from "./components/ReaderProfileThoughts.jsx";

// import BookshelfOverview from "./components/BookshelfOverview";
// import BookshelfBooks from "./components/BookshelfBooks";

import Explore from "./views/Explore";
// import ExploreGeneral from "./components/ExploreGeneral";
// import ExploreBooks from "./components/ExploreBooks";
// import ExploreTopics from "./components/ExploreTopics";
// import ExploreReaders from "./components/ExploreReaders";

// import ThemedTopics from "./views/ThemedTopics.jsx";
// import CreateTopic from "./views/CreateTopic.jsx";
// import ThemedTopic from "./components/ThemedTopic.jsx";
// import Topic from "./views/Topic.jsx";
// import TopicBooks from "./components/TopicBooks.jsx";
// import TopicPosts from "./components/TopicPosts.jsx";
// import TopicReaders from "./components/TopicReaders.jsx";

// import BookCategories from "./views/BookCategories.jsx";
// import BookCategory from "./components/BookCategory.jsx";

// import BookCategoriesList from "./components/BookCategoriesList.jsx";
// import AdminLayout from "./layout/AdminLayout.jsx";
// import Admin from "./views/Admin.jsx";

import ScrollToTop from "./components/ScrollToTop.jsx";
// import { loadInitials } from "./loaders/index.js";
import * as Loader from "./loaders/index.js";
// import Completion from "./views/Completion.jsx";
// import Premium from "./views/Premium.jsx";
// import ShareQuote from "./views/ShareQuote.jsx";
// import ShareThought from "./views/ShareThought.jsx";
// import Notifications from "./views/Notifications.jsx";
// import { Suspense } from "react";

const Home = lazy(() => import("./views/Home"));
const ExploreBooks = lazy(() => import("./components/ExploreBooks"));
const ExploreTopics = lazy(() => import("./components/ExploreTopics"));
const ExploreReaders = lazy(() => import("./components/ExploreReaders"));
const ExploreGeneral = lazy(() => import("./components/ExploreGeneral"));
const BookCategories = lazy(() => import("./views/BookCategories"));
const BookCategoriesList = lazy(() =>
  import("./components/BookCategoriesList")
);
const Search = lazy(() => import("./views/Search"));
import { ClipLoader } from "react-spinners";

function App() {
  const router = createBrowserRouter([
    // {
    //   path: "/return",
    //   element: <Completion />,
    // },
    // {
    //   path: "/signup",
    //   element: <Signup />,
    // },
    // {
    //   path: "/login",
    //   element: <Login />,
    // },
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
              element: (
                <Suspense
                  fallback={
                    <ClipLoader
                      color="#cf7e05"
                      className="position-fixed top-50 end-50 start-50"
                    ></ClipLoader>
                  }
                >
                  <Home />
                </Suspense>
              ),
              loader: Loader.loadHomePagePosts,
              // lazy: async () => {
              //   const [Component, loader] = await Promise.all([
              //     import("./views/Home.jsx"),
              //     import("./loaders/index.js"),
              //   ]);
              //   return {
              //     Component: Component.default,
              //     loader: loader.loadHomePagePosts,
              //   };
              // },
            },
            {
              path: "/search",
              // lazy: async () => {
              //   const [Component, loader] = await Promise.all([
              //     import("./views/Search.jsx"),
              //     import("./loaders/index.js"),
              //   ]);
              //   return {
              //     Component: Component.default,
              //     loader: loader.loadSearch,
              //   };
              // },
              element: (
                <Suspense
                  fallback={
                    <ClipLoader
                      color="#cf7e05"
                      className="position-fixed top-50 end-50 start-50"
                    ></ClipLoader>
                  }
                >
                  <Search />
                </Suspense>
              ),
              loader: Loader.loadSearch,
            },
            // {
            //   path: "/premium",
            //   element: <Premium />,
            // },
            // {
            //   path: "/notifications",
            //   element: <Notifications />,
            //   loader: Loader.loadReaderNotifications,
            // },
            // {
            //   path: "/share-review",
            //   element: <ShareReview />,
            //   loader: Loader.loadBookDetailsForPost,
            // },
            // {
            //   path: "/share-quote",
            //   element: <ShareQuote />,
            //   loader: Loader.loadBookDetailsForPost,
            // },
            // {
            //   path: "/share-thought",
            //   element: <ShareThought />,
            //   loader: Loader.loadBookDetailsForPost,
            // },
            // {
            //   path: "/create-topic",
            //   element: <CreateTopic />,
            //   loader: Loader.loadCreateTopic,
            // },
            // {
            //   path: "/topic-category/:category",
            //   element: <ThemedTopics />,
            //   loader: Loader.loadThemedTopics,
            // },
            // {
            //   path: "/topic/:topicName",
            //   element: <Topic />,
            //   loader: Loader.loadTopic,
            //   children: [
            //     {
            //       index: true,
            //       element: <TopicBooks />,
            //       loader: Loader.loadTopicBooks,
            //     },
            //     {
            //       path: "posts",
            //       element: <TopicPosts />,
            //       loader: Loader.loadTopicPosts,
            //     },
            //     {
            //       path: "readers",
            //       element: <TopicReaders />,
            //       loader: Loader.loadTopicReaders,
            //     },
            //   ],
            // },
            {
              path: "/explore",
              // lazy: async () => {
              //   const [Component, loader] = await Promise.all([
              //     import("./views/Explore.jsx"),
              //     import("./loaders/index.js"),
              //   ]);
              //   return {
              //     Component: Component.default,
              //     loader: loader.loadExplore,
              //   };
              // },
              element: <Explore />,
              loader: Loader.loadExplore,
              children: [
                {
                  index: true,
                  // lazy: async () => {
                  //   const [Component, loader] = await Promise.all([
                  //     import("./components/ExploreGeneral.jsx"),
                  //     import("./loaders/index.js"),
                  //   ]);
                  //   return {
                  //     Component: Component.default,
                  //     loader: loader.loadExploreGeneral,
                  //   };
                  // },
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <ExploreGeneral />
                    </Suspense>
                  ),
                  loader: Loader.loadExploreGeneral,
                },
                {
                  path: "books",
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <ExploreBooks />
                    </Suspense>
                  ),
                  loader: Loader.loadExploreBooks,
                },
                {
                  path: "topics",
                  element: (
                    <Suspense
                      fallback={
                        <ClipLoader
                          color="#cf7e05"
                          className="position-fixed top-50 end-50 start-50"
                        ></ClipLoader>
                      }
                    >
                      <ExploreTopics />
                    </Suspense>
                  ),
                  loader: Loader.loadExploreTopics,
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
                      <ExploreReaders />
                    </Suspense>
                  ),
                  loader: Loader.loadExploreReaders,
                },
              ],
            },
            // {
            //   path: "/profile/:profile",
            //   element: <ReaderProfile />,
            //   loader: Loader.loadReaderProfile,
            //   children: [
            //     {
            //       index: true,
            //       element: <ReaderProfileReviews />,
            //       loader: Loader.loadReaderReviews,
            //     },
            //     {
            //       path: "bookshelf",
            //       element: <ReaderProfileBookshelf />,
            //       children: [
            //         {
            //           index: true,
            //           element: <BookshelfOverview />,
            //           loader: Loader.loadReaderBookshelfOverview,
            //         },
            //         {
            //           path: "books",
            //           element: <BookshelfBooks />,
            //           loader: Loader.loadReaderBooks,
            //         },
            //       ],
            //     },
            //     {
            //       path: "comments",
            //       element: <ReaderProfileComments />,
            //       loader: Loader.loadReaderComments,
            //     },
            //     {
            //       path: "quotes",
            //       element: <ReaderProfileQuotes />,
            //       loader: Loader.loadReaderQuotes,
            //     },
            //     {
            //       path: "thoughts",
            //       element: <ReaderProfileThoughts />,
            //       loader: Loader.loadReaderThoughts,
            //     },
            //   ],
            // },
            // {
            //   path: "/posts/:postType/:postId",
            //   element: <ReaderPostComments />,
            //   loader: Loader.loadReaderPostComments,
            // },
            {
              path: "/book-categories",
              element: (
                <Suspense
                  fallback={
                    <ClipLoader
                      color="#cf7e05"
                      className="position-fixed top-50 end-50 start-50"
                    ></ClipLoader>
                  }
                >
                  <BookCategories />
                </Suspense>
              ),
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
                      <BookCategoriesList />
                    </Suspense>
                  ),
                  loader: Loader.loadBookCategoriesList,
                },
                // {
                //   path: ":categoryId",
                //   element: <BookCategory />,
                //   loader: Loader.loadBookCategory,
                // },
              ],
            },
            // {
            //   path: "/book/:bookTitle/:bookId",
            //   element: <BookDetails />,
            //   loader: Loader.loadBookDetails,
            //   children: [
            //     {
            //       index: true,
            //       element: <BookDetailsAbout />,
            //       loader: Loader.loadBookStatistics,
            //     },
            //     {
            //       path: "reviews",
            //       element: <BookDetailsReviews />,
            //       loader: Loader.loadReviews,
            //     },
            //     {
            //       path: "statistics",
            //       element: <BookDetailsStatistics />,
            //       loader: Loader.loadBookStatistics,
            //     },
            //     {
            //       path: "readers",
            //       element: <BookDetailsReaders />,
            //       loader: loadReaderProfiles,
            //     },
            //   ],
            // },
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
