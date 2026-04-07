const jwt = require("jsonwebtoken");
const { logger } = require("./logger");

let currentToken = null;
let decodedToken = null;

exports.setToken = (token) => {
  currentToken = token;
  if (token) {
    decodedToken = jwt.decode(token);
    logger.debug("Token decoded and stored", { 
      userId: decodedToken?.sub,
      username: decodedToken?.preferred_username,
      roles: decodedToken?.realm_access?.roles 
    });
  } else {
    decodedToken = null;
    logger.debug("Token cleared");
  }
};

exports.getToken = () => currentToken;

exports.clearToken = () => {
  currentToken = null;
  decodedToken = null;
};

exports.getUserRoles = () => {
  if (decodedToken && decodedToken.realm_access) {
    return decodedToken.realm_access.roles || [];
  }
  return [];
};

exports.getScope = () => {
  if (decodedToken) {
    return decodedToken.scope || "";
  }
  return "";
};

exports.getDecodedToken = () => decodedToken;