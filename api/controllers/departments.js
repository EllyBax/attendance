import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DepartmentsController {
  async newDepartment(DepartmentData) {
    try {
      return await prisma.department.create({
        data: {
          code: DepartmentData.departmentCode,
          name: DepartmentData.name,
        },
      });
    } catch (error) {
      console.error("Couldn't create department!", error);
      throw new Error(`Couldn't create department: ${error}`);
    }
  }

  async assignHod(HodData) {
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
      console.error("Couldn't assign HOD ", error);
      throw new Error(`Error assigning HOD ${error}`);
    }
  }

  async fetchDepartments() {
    try {
      return await prisma.department.findMany();
    } catch (error) {
      console.error("Error fetching departments\n");
      throw new Error(`Error fetching departments: ${error}`);
    }
  }
}


export default new DepartmentsController();
