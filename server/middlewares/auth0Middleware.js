import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";


export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-6tss1b7wf5huiury.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://dev-6tss1b7wf5huiury.us.auth0.com/api/v2/",
  issuer: "https://dev-6tss1b7wf5huiury.us.auth0.com/",
  algorithms: ["RS256"],
});

