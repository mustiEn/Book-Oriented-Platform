export const fetchCsrfToken = async () => {
  let token;
  try {
    const res = await fetch("/api/csrf-token", {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to get CSRF token");
    }

    token = data.csrfToken;
  } catch (err) {
    console.error("Failed to get CSRF token", err);
  }

  return token;
};
