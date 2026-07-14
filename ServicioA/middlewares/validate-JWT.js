import jwt from 'jsonwebtoken';

const getTokenFromRequest = (req) => {
  const xToken = req.header('x-token');
  const authorization = req.header('Authorization');

  if (xToken) {
    return xToken;
  }

  if (authorization?.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7).trim();
  }

  return null;
};

export const validateJWT = (req, res, next) => {
  const jwtConfig = {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  if (!jwtConfig.secret) {
    console.error('Error de validacion JWT: JWT_SECRET no esta definido');
    return res.status(500).json({
      success: false,
      message: 'Configuracion del servidor invalida: falta JWT_SECRET',
      error: 'JWT_CONFIG_ERROR',
    });
  }

  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No se proporciono un token',
      error: 'MISSING_TOKEN',
    });
  }

  try {
    const verifyOptions = {};

    if (jwtConfig.issuer) {
      verifyOptions.issuer = jwtConfig.issuer;
    }

    if (jwtConfig.audience) {
      verifyOptions.audience = jwtConfig.audience;
    }

    const decoded = jwt.verify(token, jwtConfig.secret, verifyOptions);

    req.user = {
      id: decoded.sub,
      jti: decoded.jti,
      iat: decoded.iat,
      role: decoded.role || 'USER_ROLE',
    };

    next();
  } catch (error) {
    console.error('Error de validacion JWT:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado',
        error: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalido',
        error: 'INVALID_TOKEN',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al validar el token',
      error: 'TOKEN_VALIDATION_ERROR',
    });
  }
};
