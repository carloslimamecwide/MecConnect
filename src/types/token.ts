export type MyTokenPayload = {
  jti: string;
  nameid: string;
  email: string;
  given_name: string;
  app_id: string;
  role: string | string[];
  nbf: number;
  exp: number;
  iat: number;
};
