const { default: axios } = require("axios");

exports.isLogin = async () => {
  const token = localStorage.getItem("d-token");
  if (!token) return false;
  try {
    const res = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/auth/checkLogin`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true;
  } catch (err) {
    return false;
  }
};

exports.login = async (email, password) => {
  try {
    const res = await axios.post(
      `${process.env.BASE_API_URL}/api/v1/auth/dashboard-login`,
      { email, password }
    );
    localStorage.setItem("d-token", res.data.token);
    return { error: false, data: res.data };
  } catch (err) {
    return { error: true, data: err.response.data };
  }
};
