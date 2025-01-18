import toast from "react-hot-toast";

export const loadTopicCategories = async () => {
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

export const loadThemedTopics = async ({ params }) => {
  const response = await fetch(`/api/get-themed-topics/${params.category}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log(data);
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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  // console.log(data);
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

export const loadBookDetailsAndHeader = async ({ params }) => {
  try {
    const { bookId } = params;
    const [res1, res2, res3] = await Promise.all([
      fetch(`/api/books/v1/${bookId}`),
      fetch(`/api/get-reader-book-details/${bookId}`),
      fetch(`/api/set-reader-book-record/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();
    if (!res1.ok) {
      throw new Error(res1);
    }
    if (!res2.ok) {
      throw new Error(res2);
    }
    if (!res3.ok) {
      throw new Error(res3);
    }
    return { bookDetails: data1, readerBookDetailsHeader: data2 };
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
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
  const response = await fetch(`/api/${username}/display-reader-profile`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  return data;
};

export const loadReaderComments = async () => {
  const response = await fetch("/api/get-reader-comments/0");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  console.log(response);

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

export const loadBookDetailsShareReview = async ({ params }) => {
  const { bookId } = params;
  const res = await fetch(`/api/books/v1/${bookId}`);
  const data = await res.json();
  if (!res.ok) {
    return "Sometinhg went wrong";
  }
  return data;
};

export const loadExploreGeneral = async () => {
  const response = await fetch("/api/get-explore-general");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  return data;
};
