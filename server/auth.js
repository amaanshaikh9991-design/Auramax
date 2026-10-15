import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(hash, password) {
  return await bcrypt.compare(password, hash);
}
