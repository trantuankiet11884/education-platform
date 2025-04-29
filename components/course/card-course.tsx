import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icons } from "../icons";
import { Course } from "@/lib/data";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";

type CardCourseProps = {
  course: Course;
};

export default function CardCourse({ course }: CardCourseProps) {
  return (
    <Card
      key={course._id}
      className="flex flex-col overflow-hidden border shadow-sm"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          className="object-cover w-full h-full transition-all hover:scale-105"
        />
        <Badge className="absolute top-2 right-2">{course.category}</Badge>
      </div>
      <CardHeader className="flex-1">
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Icons.bookOpen className="h-4 w-4" />
            <span>{course.lessonCount} lessons</span>
          </div>
          <div>
            <span className="font-medium">
              {course.price === 0
                ? "Free Course"
                : `$${course.price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course._id}`} className="w-full">
          <Button className="w-full">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
