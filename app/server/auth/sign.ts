import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * =========================
 * TOKEN PAYLOAD PADRÃO
 * =========================
 */
export type TokenPayload = {
  sub: string;
  email: string;
  role: "user" | "admin";
};

/**
 * =========================
 * GERAR TOKEN
 * =========================
 */
export async function signToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * =========================
 * VERIFICAR TOKEN
 * =========================
 */
export async function verifyToken<T = JWTPayload>(
  token: string | undefined
): Promise<T | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  }
}