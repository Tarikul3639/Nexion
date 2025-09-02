// utils/clearAuthData.ts

export const clearAuthData = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Clear cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
