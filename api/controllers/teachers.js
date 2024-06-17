import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TeachersController {
  async newTeacher(TeacherData) {
    try {
      return await prisma.teacher.create({
        data: {
          id: TeacherData.id,
          name: TeacherData.name,
          departmentCode: TeacherData.departmentCode,
        },
      });
    } catch (error) {
      console.error("Couldn't create teacher!", error);
      throw new Error(`Couldn't create teacher: ${error.message}`);
    }
  }

  async fetchTeachers() {
    try {
      return await prisma.teacher.findMany();
    } catch (error) {
      console.error("Couldn't fetch teachers!", error);
      throw new Error(`Couldn't fetch teachers: ${error.message}`);
    }
  }
}


export default new TeachersController()