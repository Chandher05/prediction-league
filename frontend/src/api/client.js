import { auth } from "../Firebase/config";

const API_BASE = (
  process.env.REACT_APP_API_BE ||
  "https://observant-creation-production.up.railway.app"
).replace(/\/+$/, "");

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

async function getFreshToken() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
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

  const response = await fetch(`${API_BASE}${path}`, requestOptions);
  const data = await parseResponse(response);

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

export { API_BASE, ApiError, apiRequest };
