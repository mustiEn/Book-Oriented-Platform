import toast from "react-hot-toast";

export const loadInitials = async () => {
  const response = await Promise.all([
    fetch("/api/get-reader-info"),
    fetch("/api/get-sidebar-topics"),
  ]);
  const data = await Promise.all(
    response.map(async (item) => await item.json())
  );
  for (const res of response) {
    if (!res.ok) {
      throw new Error(res.error);
    }
  }
  return data;
};

export const loadReaderNotifications = async () => {
  try {
    const res = await fetch("/api/get-reader-notifications");

    if (!res.ok) {
      throw new Error(res.error);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const loadHomePagePosts = async () => {
  const res = await fetch("/api/get-home-page-posts/0");

  if (!res.ok) {
    throw new Error(res.error);
  }

  const data = await res.json();
  console.log(data);

  return data;
};

export const loadExploreGeneral = async () => {
  const response = await Promise.all([
    fetch("/api/get-topic-categories"),
    fetch("/api/get-explore-general"),
  ]);

  for (const res of response) {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  }
  const data = await Promise.all([response[0].json(), response[1].json()]);
  console.log(data);

  // return { topicCategories, topics };
  return data;
};

export const loadExploreTopics = async () => {
  const response = await Promise.all([
    fetch("/api/get-topic-categories"),
    fetch("/api/get-explore-topics"),
  ]);

  for (const res of response) {
    if (!res.ok) {
      throw new Error(res.error);
    }
  }
  const data = await Promise.all([response[0].json(), response[1].json()]);
  console.log(data);

  return data;
};

export const loadExploreReaders = async () => {
  const res = await fetch("/api/get-explore-readers");

  if (!res.ok) {
    throw new Error(res.error);
  }

  const data = await res.json();
  return data;
};

export const loadExploreBooks = async () => {
  const response = await fetch("/api/get-explore-books");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  console.log(data);
  return data;
};

export const loadThemedTopics = async ({ params }) => {
  const response = await fetch(`/api/get-themed-topics/${params.category}`);

  if (!response.ok) {
    throw new Error(res.error);
  }

  const data = await response.json();
  return data;
};

export const loadCreateTopic = async () => {
  const res = await fetch(`/api/get-topic-categories`);

  if (!res.ok) {
    throw new Error(res.error);
  }

  const data = await res.json();
  return data;
};

export const loadReaderThoughts = async ({ params }) => {
  const { profile: username } = params;
  const response = await fetch(`/api/${username}/get-reader-thoughts`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log(data);
  return data;
};

export const loadTopic = async ({ params }) => {
  const { topicName } = params;
  const response = await fetch(`/api/get-topic/${topicName}`);

  if (!response.ok) {
    throw new Error(res.error);
  }

  const data = await response.json();

  return data;
};

export const loadTopicPosts = async ({ request, params }) => {
  const { topicName } = params;
  const q = new URL(request.url);
  const postType = q.pathname.slice(21) || "all";
  const search = q.search;
  console.log(q);

  const response = await fetch(
    `/api/get-topic-posts/${topicName}/${postType}${search}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log(data);
  return data;
};

export const loadTopicBooks = async ({ params }) => {
  const { topicName } = params;
  const response = await fetch(`/api/get-topic-books/${topicName}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  // console.log(data);
  return data;
};

export const loadTopicReaders = async ({ params }) => {
  const { topicName } = params;
  const response = await fetch(`/api/get-topic-readers/${topicName}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  return data;
};

export const loadBookDetails = async ({ params }) => {
  try {
    const { bookId } = params;
    const response = await Promise.all([
      fetch(`/api/books/v1/${bookId}`),
      fetch(`/api/get-reader-book-interaction-data/${bookId}`),
      fetch(`/api/set-reader-book-record/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    for (const res of response) {
      if (!res.ok) {
        throw new Error(res.error);
      }
    }
    const data = await Promise.all(
      response.map(async (item) => await item.json())
    );
    console.log(data);

    return data;
    // return { bookDetails: data1, readerBookDetailsHeader: data2 };
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
};

export const loadReaderProfiles = async ({ request, params }) => {
  const q = new URL(request.url).searchParams.get("q");
  const { bookId } = params;
  console.log(q);
  const response = await fetch(
    `/api/get-reader-profiles/${bookId}/reader?q=${q}`
  );

  for (const res of response) {
    if (!res.ok) {
      throw new Error(res.error);
    }
  }
  const data = await Promise.all([response[0].json(), response[1].json()]);

  return data;
};

export const loadReviews = async ({ params }) => {
  const { bookId } = params;
  const response = await fetch(`/api/get-book-reviews/${bookId}`);

  const data = await response.json();

  return data;
};

export const loadBookStatistics = async ({ params }) => {
  const { bookId } = params;
  const response = await fetch(`/api/get-book-statistics/${bookId}`);
  const data = await response.json();
  if (!response.ok) {
    console.log(response, data);
    throw new Error("response");
  }
  // console.log(response, data);
  return data;
};

export const loadReaderProfile = async ({ params }) => {
  const { profile: username } = params;
  console.log(username);

  const res = await fetch(`/api/${username}/display-reader-profile`);

  if (!res.ok) {
    throw new Error(res.error);
  }

  const data = await res.json();
  return data;
};

export const loadReaderComments = async ({ params }) => {
  const { profile: username } = params;
  console.log(params);

  const response = await fetch(`/api/get-reader-comments/${username}/0`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log(response);

  return data;
};

export const loadReaderPostComments = async ({ params }) => {
  const { postType, postId } = params;

  const response = await fetch(`/api/${postType}/${postId}`);

  if (!response.ok) {
    throw new Error(response.error);
  }

  const data = await response.json();
  console.log("index load reader post comments", data);

  return data;
};

export const loadReaderQuotes = async ({ params }) => {
  const { profile: username } = params;
  const response = await fetch(`/api/${username}/get-reader-quotes`);
  console.log(username);

  if (!response.ok) {
    toast.error("Something went wrong");
    throw new Error(response);
  }
  const data = await response.json();
  return data;
};

export const loadReaderReviews = async ({ params }) => {
  const { profile: username } = params;
  const response = await fetch(`/api/${username}/get-reader-reviews`);
  console.log(username);

  if (!response.ok) {
    toast.error("Something went wrong");
    throw new Error(response);
  }
  const data = await response.json();
  return data;
};

export const loadReaderBooks = async ({ request }) => {
  const q = new URL(request.url).search;
  const response = await fetch(`/api/profile/books${q}`);
  console.log(q);

  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log("location");
  console.log(q);

  return data;
};

export const loadReaderBookshelfOverview = async () => {
  const response = await fetch(`/api/profile/bookshelf/get-bookshelf-overview`);

  const data = await response.json();
  if (!response.ok) {
    toast.error(data.message);
    throw new Error(response);
  }
  return data;
};

export const loadBookDetailsForPost = async () => {
  const res = await fetch("/api/get-topics");

  if (!res.ok) {
    throw new Error(res.error);
  }

  const data = await res.json();

  return data;
};

export const loadBookCategoriesList = async () => {
  const res = await fetch("/api/get-book-categories");
  console.log("book categories");

  const data = await res.json();
  if (!res.ok) {
    throw new Error(response);
  }
  console.log(data);

  return data;
};

export const loadBookCategory = async ({ params }) => {
  const { categoryId } = params;
  console.log("book category", categoryId);

  const response = await fetch(`/api/get-book-category/${categoryId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log(data);

  return data;
};
