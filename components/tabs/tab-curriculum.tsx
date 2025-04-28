import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Course, Lesson } from "@/lib/data";

interface TabsCurriculumProps {
  course: Course;
  lessons: Lesson[];
}

export default function TabsCurriculum({
  course,
  lessons,
}: TabsCurriculumProps) {
  return (
    <TabsContent value="curriculum" className="mt-4">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Course Content</h3>
        <p>
          {course.lessonCount} lessons • {Math.round(course.duration / 60)}{" "}
          hours total
        </p>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Card key={lesson._id}>
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {lesson.duration} min
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </TabsContent>
  );
}
