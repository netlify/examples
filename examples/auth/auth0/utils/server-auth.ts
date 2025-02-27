import { type JWTVerifyResult, createRemoteJWKSet, jwtVerify } from "jose";

export type VerifyAuth0TokenResult<
  CustomClaims extends Record<string, unknown> = Record<string, unknown>,
> = {
  token: string;
  result: JWTVerifyResult & { payload: CustomClaims };
};


export const verifyAuth0Token = async <
  CustomClaims extends Record<string, unknown>,
>(
  request: Request,
): Promise<VerifyAuth0TokenResult<CustomClaims>> => {
  const authorization = request.headers.get("Authorization") ?? "";
  const [type, token, ...parts] = authorization
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  if (type !== "Bearer" || parts.length !== 0) {
    throw new Error("Missing or invalid Authorization header");
  }

  const AUTH0_ISSUER = process.env.AUTH0_ISSUER;
  const AUTH0_AUDIENCE = process.env.PUBLIC_AUTH0_AUDIENCE;

  const JWKS = createRemoteJWKSet(
    new URL(".well-known/jwks.json", AUTH0_ISSUER),
  );
  
  const result = (await jwtVerify(token, JWKS, {
    issuer: AUTH0_ISSUER,
    audience: AUTH0_AUDIENCE,
  })) as unknown as JWTVerifyResult & { payload: CustomClaims };
  
  return { token, result };
};
