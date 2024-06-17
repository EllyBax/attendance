import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CoursesController {
  async newCourse(CourseData) {
    try {
      return await prisma.course.create({
        data: {
          code: CourseData.code,
          name: CourseData.name,
          departmentCode: CourseData.departmentCode,
        },
      });
    } catch (error) {
      console.error("Couldn't create course!", error);
      throw new Error(`Couldn't create course: ${error.message}`);
    }
  }

  async assignCourseToClass(courseCode, classId) {
    try {
      return await prisma.course.update({
        where: { code: courseCode },
        data: { classId: classId },
      });
    } catch (error) {
      console.error("Couldn't assign course to class!", error);
      throw new Error(`Couldn't assign course to class: ${error.message}`);
    }
  }

  async fetchCourses(){
    try{
      return await prisma.course.findMany()
    }
    catch(err){
      console.error("Couldn't fetch courses\n");
      throw new Error(`Couldn't fetch courses: ${err}`);
    }
  }
}

export default new CoursesController()