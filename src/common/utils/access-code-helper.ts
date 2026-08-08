import {
  ACCESS_CODE_CHARSET,
  ACCESS_CODE_LENGTH,
  ACCESS_CODE_PREFIX,
} from "../constants";

export function generateAccessCode() {
  let suffix = "";

  for (let i = 0; i < ACCESS_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(
      Math.random() * ACCESS_CODE_CHARSET.length
    );

    suffix += ACCESS_CODE_CHARSET[randomIndex];
  }

  return `${ACCESS_CODE_PREFIX}-${suffix}`;
}