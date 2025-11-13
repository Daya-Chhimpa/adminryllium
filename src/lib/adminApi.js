const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || "https://backend-a-dev.nexbric.net";

const ADMIN_AUTH_TOKEN_KEY = "adminAuthToken";

export function setAdminAuthToken(token) {
  try {
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
      }
    }
  } catch {}
}

export function getAdminAuthToken() {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) || "";
    }
  } catch {}
  return "";
}

export function clearAdminAuthToken() {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
      window.sessionStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    }
  } catch {}
}

export async function adminApiRequest(path, options = {}) {
  const url = `${ADMIN_BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  try {
    const token = getAdminAuthToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  } catch {}
  const init = {
    method: options.method || "GET",
    headers,
    body: typeof options.body === "string" ? options.body : options.body ? JSON.stringify(options.body) : undefined,
    credentials: "omit",
    cache: "no-store",
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const adminEndpoints = {
  health: () => "/health",
  login: () => "/auth/login",
  generalStats: () => "/general_stats",
  users: (query = "") => `/users${query ? `?${query}` : ""}`,
  userById: (id) => `/user/${encodeURIComponent(id)}`,
  banUser: () => "/ban_user", // PUT { userId, isBanned, banReason }
  lockUser: () => "/lock_user", // PUT { userId, isLocked, lockDuration }
};


