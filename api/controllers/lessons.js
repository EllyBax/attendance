import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class LessonsController {
  async newLesson(LessonData) {
    try {
      return await prisma.lesson.create({
        data: {
          id: LessonData.id,
          date: LessonData.date,
          startTime: LessonData.startTime,
          endTime: LessonData.endTime,
          teacherId: LessonData.teacherId,
        },
      });
    } catch (error) {
      console.error("Couldn't create lesson!", error);
      throw new Error(`Couldn't create lesson: ${error.message}`);
    }
  }

  async recordAttendance(attendanceData) {
    try {
      return await prisma.attendance.createMany({
        data: attendanceData,
      });
    } catch (error) {
      console.error("Couldn't record attendance!", error);
      throw new Error(`Couldn't record attendance: ${error.message}`);
    }
  }
}
