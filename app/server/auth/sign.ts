import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// =========================
// PAYLOAD PADRÃO
// =========================
export type TokenPayload = {
  sub: string;
  email?: string;
  role?: "user" | "admin";
};

// =========================
// ASSINAR TOKEN
// =========================
export async function signToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

// =========================
// VERIFICAR TOKEN
// =========================
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as TokenPayload;
}