import argon from "argon2";

class PasswordController {
  async hashPassword(password) {
    return await argon.hash(password);
  }

  async verifyPassword(hashedPassword, password) {
    return await argon.verify(hashedPassword, password);
  }
}

export default new PasswordController();