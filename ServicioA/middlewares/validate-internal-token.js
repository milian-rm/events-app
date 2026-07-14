'use strict';

import crypto from 'crypto';
import { validateJWT } from './validate-JWT.js';

const compareTokens = (tokenA, tokenB) => {
  if (!tokenA || !tokenB) return false;

  const bufferA = Buffer.from(tokenA);
  const bufferB = Buffer.from(tokenB);

  if (bufferA.length !== bufferB.length) return false;

  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const validateInternalToken = (req, res, next) => {
  const internalToken = req.header('x-internal-token');
  const secretToken = process.env.INTERNAL_SERVICE_TOKEN;

  if (!secretToken) {
    console.warn('INTERNAL_SERVICE_TOKEN no está configurado en service-events');
  }

  if (compareTokens(internalToken, secretToken)) {
    req.user = { id: 'SYSTEM_USER', role: 'INTERNAL_SERVICE' };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Acceso denegado: Token interno inválido o ausente',
  });
};

// Permite el acceso si viene un x-internal-token válido (Servicio B) O un JWT válido (Frontend)
export const authOrInternal = (req, res, next) => {
  const internalToken = req.header('x-internal-token');
  const secretToken = process.env.INTERNAL_SERVICE_TOKEN;

  if (compareTokens(internalToken, secretToken)) {
    req.user = { id: 'SYSTEM_USER', role: 'INTERNAL_SERVICE' };
    return next();
  }

  return validateJWT(req, res, next);
};
