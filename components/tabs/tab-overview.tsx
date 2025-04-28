import { TabsContent } from "@/components/ui/tabs";
import { Course } from "@/lib/data";

interface TabsOverviewProps {
  course: Course;
}

export default function TabsOverview({ course }: TabsOverviewProps) {
  return (
    <TabsContent value="overview" className="mt-4">
      <div className="prose dark:prose-invert max-w-none">
        <p>{course.description}</p>
        <h3>What you'll learn</h3>
        <ul>
          <li>Build real-world applications with the latest technologies</li>
          <li>Understand core concepts and best practices</li>
          <li>Implement industry-standard solutions</li>
          <li>Deploy your applications to production</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
          <li>Basic understanding of programming concepts</li>
          <li>A computer with internet access</li>
          <li>Enthusiasm to learn and practice</li>
        </ul>
      </div>
    </TabsContent>
  );
}
