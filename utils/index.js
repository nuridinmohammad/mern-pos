function getToken(req) {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(" ")[1] : null;
  return token && token.length ? token : null;
}

module.exports = getToken
