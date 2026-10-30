const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function cookieValue(name) {
  const row = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
}

export async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const csrf = cookieValue("XSRF-TOKEN");
  if (csrf && !["GET", "HEAD", "OPTIONS"].includes(method)) headers.set("X-XSRF-TOKEN", csrf);

  let response;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      method,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError("The request timed out. Check your connection and try again.", 0);
    }
    throw new ApiError("Unable to reach AlgoVista. Check your connection and try again.", 0);
  } finally {
    window.clearTimeout(timeout);
  }

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !["/auth/login", "/auth/signup"].includes(path)) {
      window.dispatchEvent(new Event("algovista:unauthorized"));
    }
    const message = payload?.message || (response.status === 401
      ? "Please log in to continue."
      : "Something went wrong. Please try again.");
    throw new ApiError(message, response.status);
  }
  return payload;
}

export const api = {
  csrf: () => request("/auth/csrf"),
  me: () => request("/auth/me"),
  signup: async (input) => {
    await api.csrf();
    return request("/auth/signup", { method: "POST", body: JSON.stringify(input) });
  },
  login: async (input) => {
    await api.csrf();
    return request("/auth/login", { method: "POST", body: JSON.stringify(input) });
  },
  logout: () => request("/auth/logout", { method: "POST" }),
  topics: () => request("/topics"),
  topic: (slug) => request(`/topics/${encodeURIComponent(slug)}`),
  questions: (params = {}) => request(`/questions?${new URLSearchParams(params)}`),
  topicQuestions: (slug, params = {}) => request(`/topics/${encodeURIComponent(slug)}/questions?${new URLSearchParams(params)}`),
  question: (slug) => request(`/questions/${encodeURIComponent(slug)}`),
  bookmarks: () => request("/bookmarks"),
  addBookmark: (id) => request(`/bookmarks/${id}`, { method: "POST" }),
  removeBookmark: (id) => request(`/bookmarks/${id}`, { method: "DELETE" }),
  comments: (id, page = 0) => request(`/questions/${id}/comments?page=${page}&size=20`),
  postComment: (id, content) => request(`/questions/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  editComment: (id, content) => request(`/comments/${id}`, { method: "PUT", body: JSON.stringify({ content }) }),
  deleteComment: (id) => request(`/comments/${id}`, { method: "DELETE" }),
  profile: () => request("/users/me"),
  updateProfile: (input) => request("/users/me", { method: "PUT", body: JSON.stringify(input) }),
};
