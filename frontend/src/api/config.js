const API_BASE = (
  process.env.REACT_APP_API_BE ||
  "https://observant-creation-production.up.railway.app"
).replace(/\/+$/, "");

export { API_BASE };
