import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ClassesController {
  async newClass(ClassData) {
    try {
      return await prisma.class.create({
        data: {
          name: ClassData.name,
        },
      });
    } catch (error) {
      console.error("Couldn't create class!", error);
      throw new Error(`Couldn't create class: ${error.message}`);
    }
  }

  async addStudentToClass(classId, studentId) {
    try {
      return await prisma.student.update({
        where: { registrationNumber: studentId },
        data: { classId: classId },
      });
    } catch (error) {
      console.error("Couldn't add student to class!", error);
      throw new Error(`Couldn't add student to class: ${error.message}`);
    }
  }

  async fetchClasses() {
    try {
      return await prisma.class.findMany();
    } catch (error) {
      console.error("Error fetching classs\n");
      throw new Error(`Error fetching classs: ${error}`);
    }
  }
}


export default new ClassesController()