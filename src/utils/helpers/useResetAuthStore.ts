const useResetAuthStore = () => {
  const resetAuthStore = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return resetAuthStore;
};

export default useResetAuthStore;
