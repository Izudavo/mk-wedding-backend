import { prisma } from "../../config/prisma";

import { AppError } from "../../common/errors/AppError";
import { comparePassword } from "../../common/utils/password";
import { signAdminToken } from "../../common/utils/jwt";

export async function loginAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: {
      username,
    },
  });

  if (!admin) {
    throw new AppError(401, "Invalid credentials.");
  }

  const isValid = await comparePassword(password, admin.password_hash);

  if (!isValid) {
    throw new AppError(401, "Invalid credentials.");
  }

  const token = signAdminToken({
    id: admin.id,
    username: admin.username,
  });

  return {
    token,
  };
}
