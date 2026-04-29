import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUserFromRequest(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("token=")[1]
      ?.split(";")[0];

    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);

    return payload as {
      id: string;
      role: string;
    };
  } catch {
    return null;
  }
}