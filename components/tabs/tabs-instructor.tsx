import { TabsContent } from "@/components/ui/tabs";
import { Course } from "@/lib/data";

interface TabsInstructorProps {
  course: Course;
}

export default function TabsInstructor({ course }: TabsInstructorProps) {
  return (
    <TabsContent value="instructor" className="mt-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={
                course.instructor?.avatar ||
                "/placeholder.svg?height=64&width=64"
              }
              alt={course.instructor?.name || "Instructor"}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {course.instructor?.name || "Unknown Instructor"}
            </h3>
            <p className="text-muted-foreground">
              {course.instructor?.role || "Instructor"}
            </p>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            {course.instructor?.bio || "No bio available for this instructor."}
          </p>
        </div>
      </div>
    </TabsContent>
  );
}
