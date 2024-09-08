exports.getToken = () => {
  try {
    const token =
      localStorage.getItem("d-token") ?? sessionStorage.getItem("d-token");
    return token ? token : null;
  } catch (error) {
    return null;
  }
};

exports.logoutUser = () => {
  localStorage.removeItem("d-token");
};
