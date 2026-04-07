const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const tokenStore = require('../config/tokenStore.js');
const keycloakConfig = require('../config/keycloakConfig.js');
const keycloakService = require('../services/keycloakService.js');
const { logger: authLogger } = require('../config/logger.js');

const JWT_SECRET = process.env.JWT_SECRET || 'cms-jwt-secret-change-in-production';

/**
 * Login — priority order:
 * 1. Keycloak (if REACT_APP_USE_KEYCLOAK=true and server is up)
 * 2. Test users from keycloakConfig (fallback)
 * 3. DB users with bcrypt (users created via AddUserModal)
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'missing_credentials',
        error_description: 'Username and password are required'
      });
    }

    // ── 1. Try Keycloak if configured ──────────────────────────────
    const useKeycloak = process.env.REACT_APP_USE_KEYCLOAK === 'true' ||
                        process.env.USE_KEYCLOAK === 'true';

    if (useKeycloak) {
      try {
        authLogger.info(`Keycloak authentication attempt: ${username}`);
        const result = await keycloakService.getToken(username, password);

        if (result && result.access_token) {
          tokenStore.setToken(result.access_token);
          authLogger.info(`Keycloak login successful: ${username}`);

          // Decode token to get user info
          const decoded = jwt.decode(result.access_token);
          const userData = {
            id: decoded?.sub || username,
            name: decoded?.name || username,
            username: decoded?.preferred_username || username,
            email: decoded?.email || '',
            role: decoded?.realm_access?.roles?.includes('admin') ? 'admin'
                : decoded?.realm_access?.roles?.includes('supervisor') ? 'supervisor'
                : 'client',
            roles: decoded?.realm_access?.roles || []
          };

          return res.status(200).json({
            access_token: result.access_token,
            refresh_token: result.refresh_token || '',
            token_type: 'Bearer',
            expires_in: result.expires_in || 3600,
            user: userData
          });
        }
      } catch (keycloakError) {
        authLogger.warn(`Keycloak unavailable, falling back: ${keycloakError.message}`);
        // Fall through to test users / DB
      }
    }

    // ── 2. Test users (admin/admin123, user/user123) ────────────────
    const testUser = keycloakConfig.TEST_USERS?.find(
      u => u.username === username && u.password === password
    );

    if (testUser) {
      authLogger.info(`Test user login: ${username}`);
      const now = Math.floor(Date.now() / 1000);
      const token = jwt.sign({
        sub: testUser.id,
        preferred_username: testUser.username,
        email: testUser.email,
        name: testUser.name,
        role: 'admin',
        roles: testUser.roles,
        realm_access: { roles: testUser.roles },
        iat: now,
        exp: now + 86400
      }, JWT_SECRET, { algorithm: 'HS256' });

      tokenStore.setToken(token);

      const userData = {
        id: testUser.id,
        name: testUser.name,
        username: testUser.username,
        email: testUser.email,
        role: 'admin',
        roles: ['admin']
      };

      return res.status(200).json({
        access_token: token,
        refresh_token: `refresh_${token}`,
        token_type: 'Bearer',
        expires_in: 86400,
        user: userData
      });
    }

    // ── 3. DB users (created via AddUserModal) ──────────────────────
    const [rows] = await pool.execute(
      'SELECT * FROM User WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      authLogger.warn(`Login failed - user not found: ${username}`);
      return res.status(401).json({
        error: 'authentication_failed',
        error_description: 'Invalid username or password'
      });
    }

    const dbUser = rows[0];
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordValid) {
      authLogger.warn(`Login failed - wrong password: ${username}`);
      return res.status(401).json({
        error: 'authentication_failed',
        error_description: 'Invalid username or password'
      });
    }

    const role = dbUser.role || 'admin';
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign({
      sub: dbUser.id,
      preferred_username: dbUser.username,
      email: dbUser.email || '',
      name: dbUser.username,
      role,
      roles: [role],
      realm_access: { roles: [role] },
      iat: now,
      exp: now + 86400
    }, JWT_SECRET, { algorithm: 'HS256' });

    tokenStore.setToken(token);

    const userData = {
      id: dbUser.id,
      name: dbUser.username,
      username: dbUser.username,
      email: dbUser.email || '',
      role,
      roles: [role]
    };

    authLogger.info(`DB user login successful: ${username}, role: ${role}`);

    return res.status(200).json({
      access_token: token,
      refresh_token: `refresh_${token}`,
      token_type: 'Bearer',
      expires_in: 86400,
      user: userData
    });

  } catch (error) {
    authLogger.error('Login error:', { error: error.message });
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error during authentication'
    });
  }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (refresh_token) {
      try {
        await keycloakService.logoutUser(refresh_token);
      } catch (e) {
        // Keycloak logout failed — still clear local token
      }
    }
    tokenStore.clearToken();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    tokenStore.clearToken();
    res.status(200).json({ message: 'Logout completed' });
  }
};

/**
 * Get user info from token
 */
exports.getUserInfo = async (req, res) => {
  try {
    const token = tokenStore.getToken();
    if (!token) {
      return res.status(401).json({
        error: 'no_token',
        error_description: 'No access token found'
      });
    }

    // Try Keycloak userinfo first
    try {
      const userInfo = await keycloakService.getUserInfo();
      if (userInfo) return res.status(200).json(userInfo);
    } catch (e) {
      // Fall back to JWT decode
    }

    // Decode JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({
      sub: decoded.sub,
      preferred_username: decoded.preferred_username,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      roles: decoded.roles || []
    });

  } catch (error) {
    authLogger.error('getUserInfo error:', { error: error.message });
    return res.status(401).json({
      error: 'invalid_token',
      error_description: 'Token is invalid or expired'
    });
  }
};