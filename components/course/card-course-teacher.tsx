"use client";
import { Course } from "@/lib/data";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter } from "next/navigation";

type CardCourseProps = {
  course: Course;
};

export default function CardCourseTeacher({ course }: CardCourseProps) {
  const router = useRouter();
  return (
    <Card key={course._id} className="flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2">{course.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>
          {course.isPublished ? "Published" : "Draft"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Students</p>
            <p className="font-medium">{course.enrollmentCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rating</p>
            <p className="font-medium">{course.rating.toFixed(1)}/5</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lessons</p>
            <p className="font-medium">{course.lessonCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium">${course.price.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            router.push(`/teacher/courses/${course._id}/lessons/new`)
          }
        >
          Edit
        </Button>
        <Button
          className="flex-1"
          onClick={() => router.push(`/teacher/courses/${course._id}`)}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
