import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ModulesController {
  async newModule(ModuleData) {
    try {
      return await prisma.module.create({
        data: {
          code: ModuleData.code,
          name: ModuleData.name,
          classId: ModuleData.classId,
        },
      });
    } catch (error) {
      console.error("Couldn't create module!", error);
      throw new Error(`Couldn't create module: ${error.message}`);
    }
  }

  async assignTeacherToModule(moduleCode, teacherId) {
    try {
      return await prisma.module.update({
        where: { code: moduleCode },
        data: { teacherId: teacherId },
      });
    } catch (error) {
      console.error("Couldn't assign teacher to module!", error);
      throw new Error(`Couldn't assign teacher to module: ${error.message}`);
    }
  }

  async fetchModules() {
    try {
      return await prisma.module.findMany();
    } catch (error) {
      console.error("Error fetching modules\n");
      throw new Error(`Error fetching modules: ${error}`);
    }
  }
}

export default new ModulesController()