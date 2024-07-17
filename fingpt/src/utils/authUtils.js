const TOKEN_KEY = "jwt";

export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    const decoded = parseJwt(token);
    return decoded;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
};
