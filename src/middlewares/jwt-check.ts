import { Request } from 'express';
import { expressjwt } from 'express-jwt';
import { jwtSecret } from '../settings';

type Cookies = {
  [k: string]: string;
};

type ReqWithCookies = Request & { cookies: Cookies };

export default expressjwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req: Request) {
    const { jwt } = (req as ReqWithCookies).cookies;
    return jwt || null;
  },
});
