import { sign, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { fromUnixTime, isAfter, toDate } from 'date-fns';

import authConfig from '@config/auth';
import AppError from '@errors/AppError';

interface ITokenPayload {
  iat: number; // Data da geração do token
  exp: number; // Data da expiração do token
  sub: string; // Id do usuário
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  const { secret, timeToRefresh, expiresIn } = authConfig.jwt;
  // let timeExp;
  // let limExp;
  // let agora;
  let decoded;

  try {
    decoded = verify(token, secret);
  } catch {
    console.log('Invalid JWT token');
    throw new AppError('Invalid JWT token', 401);
    // return;
  }
  // console.log(decoded);
  const { sub, exp } = decoded as ITokenPayload;

  const timeExp = fromUnixTime(exp);
  const limExp = toDate(
    fromUnixTime(exp).setSeconds(
      fromUnixTime(exp).getSeconds() - timeToRefresh,
    ),
  );
  const agora = toDate(Date.now());
  agora.setMilliseconds(0);

  request.user = {
    id: sub,
  };

  // console.log('timeExp ', timeExp);
  // console.log('limExp ', limExp);
  // console.log('agora ', agora);
  // response.removeHeader('refresh_token');
  // console.log(isAfter(agora, limExp) && isBefore(agora, timeExp));
  // response.cookie('newToken', token, {
  //   expires: new Date(Date.now() + 900000),
  // });
  // response.removeHeader('newToken');

  if (isAfter(agora, limExp)) {
    // const newToken = sign({}, secret, {
    //   subject: sub,
    //   expiresIn,
    // });
    // console.log('_________Limit time JWT token almost end_________');
    // //   console.log(token);
    // //   console.log(newToken);
    // // throw new AppError(`Bearer ${newToken}`, 401);
    // response.set('Access-Control-Expose-Headers', 'refresh_token');
    // response.set('refresh_token', newToken);
  }

  return next();
}
