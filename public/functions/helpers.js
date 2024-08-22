exports.getToken = () => {
  return localStorage.getItem("d-token") != undefined
    ? localStorage.getItem("d-token")
    : sessionStorage.getItem("d-token");
};
