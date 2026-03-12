import { auth, authReady } from "../Firebase/config";
import { API_BASE } from "./config";

class ApiError extends Error {
  constructor(status, message, data) {
    super(message || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function getFreshToken(forceRefresh = false) {
  await authReady;
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    return null;
  }
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    authRequired = true,
    redirectOn401 = true,
  } = options;

  const requestHeaders = { ...headers };
  const token = authRequired ? await getFreshToken() : null;

  if (authRequired && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    requestOptions.body = isFormData ? body : JSON.stringify(body);
    if (!isFormData && !requestHeaders["Content-Type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  let response = await fetch(`${API_BASE}${path}`, requestOptions);
  let data = await parseResponse(response);

  // If the backend rejected a stale token, force-refresh once before logging out.
  if (response.status === 401 && authRequired) {
    const refreshedToken = await getFreshToken(true);
    if (refreshedToken) {
      requestHeaders.Authorization = `Bearer ${refreshedToken}`;
      response = await fetch(`${API_BASE}${path}`, requestOptions);
      data = await parseResponse(response);
    }
  }

  if (!response.ok) {
    if (response.status === 401 && redirectOn401) {
      redirectToLogin();
    }
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || response.statusText;
    throw new ApiError(response.status, message, data);
  }

  return data;
}

export { ApiError, apiRequest };
