import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class HodsController {
  async newHod(HodData) {
    try {
      return await prisma.hOD.create({
        data: {
          name: HodData.name,
          email: HodData.email,
          phone: HodData.phone,
          password: HodData.password,
          departmentCode: HodData.departmentCode,
        },
      });
    } catch (error) {
      console.error("Couldn't create HOD!", error);
      throw new Error(`Couldn't create HOD: ${error.message}`);
    }
  }
}