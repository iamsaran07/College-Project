const { sign, verify } = require("jsonwebtoken");

exports.token = async (user) => {
  const accessToken = sign(
    { email: user.email, id: user.id },
    "qwertyuiopasdfghjklzxcvbnm"
  );
  return accessToken;
};

exports.sToken = async (student) => {
  const accessToken = sign(
    { studentId: student.studentId, id: student.id },
    "mnbvcxzlkjhgfdsapoiuytrewq"
  );
  return accessToken;
};

exports.validateToken = async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) return res.redirect("/ssm/mca/sessionExpired");

  try {
    const validToken = verify(accessToken, "qwertyuiopasdfghjklzxcvbnm");
    if (validToken) {
      return next();
    }
  } catch (err) {
    res.send('<script>alert("Not Authonticated"); window.location.href = "/";</script>');
    // console.log(err);
  }
};

exports.sValidateToken = async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) return res.redirect("/ssm/mca/sessionExpired");

  try {
    const validToken = verify(accessToken, "mnbvcxzlkjhgfdsapoiuytrewq");
    if (validToken) {
      return next();
    }
  } catch (err) {
    res.send('<script>alert("Not Authonticated"); window.location.href = "/";</script>');
    // console.log(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("access-token");
  res.redirect("/");
};

module.exports = exports;
