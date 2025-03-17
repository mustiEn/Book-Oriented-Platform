import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./views/Signup";
import Layout from "./layout/Layout";
import Home from "./views/Home";
import Search from "./views/Search";

import BookDetails from "./views/BookDetails";
import BookDetailsAbout from "./components/BookDetailsAbout";
import BookDetailsReviews from "./components/BookDetailsReviews";
import BookDetailsReaders, {
  loadReaderProfiles,
} from "./components/BookDetailsReaders";
import BookDetailsStatistics from "./components/BookDetailsStatistics";

import ShareReview from "./views/ShareReview";
import NotFound from "./views/NotFound";
import Error from "./views/Error";
import Login from "./views/Login";

import ReaderProfile from "./views/ReaderProfile";
import ReaderProfileBookshelf from "./components/ReaderProfileBookshelf";
import ReaderProfileReviews from "./components/ReaderProfileReviews";
import ReaderPostComments from "./components/ReaderPostComments";
import ReaderProfileComments from "./components/ReaderProfileComments";
import ReaderProfileQuotes from "./components/ReaderProfileQuotes";
import ReaderProfileThoughts from "./components/ReaderProfileThoughts.jsx";

import BookshelfOverview from "./components/BookshelfOverview";
import BookshelfBooks from "./components/BookshelfBooks";

import Explore from "./views/Explore";
import ExploreGeneral from "./components/ExploreGeneral";
import ExploreBooks from "./components/ExploreBooks";
import ExploreTopics from "./components/ExploreTopics";
import ExploreReaders from "./components/ExploreReaders";

import ThemedTopics from "./views/ThemedTopics.jsx";
import CreateTopic from "./views/CreateTopic.jsx";
import ThemedTopic from "./components/ThemedTopic.jsx";
import Topic from "./views/Topic.jsx";
import TopicBooks from "./components/TopicBooks.jsx";
import TopicPosts from "./components/TopicPosts.jsx";
import TopicPostsReview from "./components/TopicPostsReview.jsx";
import TopicPostsThought from "./components/TopicPostsThought.jsx";
import TopicPostsQuote from "./components/TopicPostsQuote.jsx";
import TopicPostsAll from "./components/TopicPostsAll.jsx";
import TopicReaders from "./components/TopicReaders.jsx";

import BookCategories from "./views/BookCategories.jsx";
import BookCategory from "./components/BookCategory.jsx";

import BookCategoriesList from "./components/BookCategoriesList.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import Admin from "./views/Admin.jsx";

import * as Loader from "./loaders/index.js";
import Payment from "./views/Payment.jsx";
import Completion from "./views/Completion.jsx";
import Premium from "./views/Premium.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/return",
      element: <Completion />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Admin />,
        },
      ],
    },
    {
      element: <Layout />,
      loader: Loader.loadInitials,
      children: [
        {
          path: "/home",
          element: <Home />,
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
          path: "/share-review/:bookId",
          element: <ShareReview />,
          loader: Loader.loadBookDetailsShareReview,
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
          // ?bak
          loader: Loader.loadTopic,
          children: [
            {
              index: true,
              element: <TopicBooks />,
              loader: Loader.loadTopicBooks,
            },
            {
              path: "posts",
              element: <TopicPosts />,
              children: [
                {
                  index: true,
                  element: <TopicPostsAll />,
                  loader: Loader.loadTopicPosts,
                },
                {
                  path: "review",
                  element: <TopicPostsReview />,
                  loader: Loader.loadTopicPosts,
                },
                {
                  path: "quote",
                  element: <TopicPostsQuote />,
                  loader: Loader.loadTopicPosts,
                },
                {
                  path: "thought",
                  element: <TopicPostsThought />,
                  loader: Loader.loadTopicPosts,
                },
              ],
            },
            {
              path: "readers",
              element: <TopicReaders />,
              loader: Loader.loadTopicReaders,
            },
          ],
        },
        {
          path: "/explore",
          element: <Explore />,
          loader: Loader.loadExplore,
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
            { path: "readers", element: <ExploreReaders /> },
          ],
        },
        {
          path: "/:profile",
          element: <ReaderProfile />,
          loader: Loader.loadReaderProfile,
          children: [
            {
              index: true,
              element: <ReaderProfileReviews />,
              loader: Loader.loadReaderReviews,
            },
            {
              path: "bookshelf",
              element: <ReaderProfileBookshelf />,
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
          ],
        },
        {
          path: "/:postType/:postId",
          element: <ReaderPostComments />,
          loader: Loader.loadReaderPostComments,
        },
        {
          path: "/book-categories",
          element: <BookCategories />,
          loader: Loader.loadBookCategories,
          children: [
            {
              index: true,
              element: <BookCategoriesList />,
              loader: Loader.loadBookCategoriesList,
            },
            {
              path: ":categoryId",
              element: <BookCategory />,
              loader: Loader.loadBookCategory,
            },
          ],
        },
        {
          path: "/book/:bookTitle/:bookId",
          element: <BookDetails />,
          loader: Loader.loadBookDetails,
          errorElement: <Error />,
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
              loader: loadReaderProfiles,
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
