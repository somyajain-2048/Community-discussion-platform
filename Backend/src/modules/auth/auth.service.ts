import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

// ======================
// REGISTER USER
// ======================
export const createUser = async (payload: any) => {
  const { username, email, password } = payload;

  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already in use");
    }
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  // 🔥 generate tokens on register
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

// ======================
// LOGIN USER
// ======================
export const loginUserService = async (payload: any) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Incorrect password");
  }

  // 🔥 USE TOKEN UTILS (NOT jwt.sign directly)
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};
