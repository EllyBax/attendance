import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class StudentsController {
  async newStudent(StudentData) {
    try {
      return await prisma.student.create({
        data: {
          registrationNumber: StudentData.registrationNumber,
          fingerprintId: StudentData.fingerprintId,
          name: StudentData.name,
          classId: StudentData.classId,
        },
      });
    } catch (error) {
      console.error("Couldn't create student!", error);
      throw new Error(`Couldn't create student: ${error.message}`);
    }
  }

  async markAttendance(attendanceData) {
    try {
      return await prisma.attendance.create({
        data: {
          lessonId: attendanceData.lessonId,
          studentId: attendanceData.studentId,
          isPresent: attendanceData.isPresent,
        },
      });
    } catch (error) {
      console.error("Couldn't mark attendance!", error);
      throw new Error(`Couldn't mark attendance: ${error.message}`);
    }
  }

  async fetchStudents(){
    try{
      return await prisma.student.findMany()
    } catch(error){
      console.error("Error fetching students\n");
      throw new Error(`Error fetching students: ${error}`);
    }
  }
}

export default new StudentsController();
