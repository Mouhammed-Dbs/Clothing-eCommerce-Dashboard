const { default: axios } = require("axios");

exports.isLogin = async () => {
  try {
    const res = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/auth/checkLogin`
    );
    return true;
  } catch (err) {
    return false;
  }
};
