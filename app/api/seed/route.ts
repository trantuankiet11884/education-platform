import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { Course } from "@/lib/models/course";
import { Lesson } from "@/lib/models/lesson";
import { Enrollment } from "@/lib/models/enrollment";
import { Review } from "@/lib/models/review";
import { Quiz } from "@/lib/models/quiz";
import { Book } from "@/lib/models/book";
import { BlogPost } from "@/lib/models/blog-post";

export async function GET() {
  try {
    await connectToDatabase();

    // Kiểm tra xem đã có dữ liệu chưa
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();

    // if (userCount > 0 || courseCount > 0) {
    //   return NextResponse.json({
    //     message: "Database already has data",
    //     userCount,
    //     courseCount,
    //   });
    // }

    // Tạo người dùng mẫu
    const instructor1 = new User({
      firebaseId: "instructor1",
      name: "John Instructor",
      email: "john@example.com",
      role: "teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Experienced web developer with 10+ years in the industry",
      createdAt: new Date(),
    });

    const instructor2 = new User({
      firebaseId: "instructor2",
      name: "Sarah Teacher",
      email: "sarah@example.com",
      role: "teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Data scientist and machine learning expert",
      createdAt: new Date(),
    });

    const student1 = new User({
      firebaseId: "student1",
      name: "Mike Student",
      email: "mike@example.com",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Aspiring web developer",
      createdAt: new Date(),
    });

    const student2 = new User({
      firebaseId: "student2",
      name: "Lisa Student",
      email: "lisa@example.com",
      role: "student",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Data science enthusiast",
      createdAt: new Date(),
    });

    const admin = new User({
      firebaseId: "admin1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Platform administrator",
      createdAt: new Date(),
    });

    await instructor1.save();
    await instructor2.save();
    await student1.save();
    await student2.save();
    await admin.save();

    // Tạo khóa học mẫu
    const course1 = new Course({
      title: "Complete Web Development Bootcamp",
      slug: "complete-web-development-bootcamp",
      shortDescription: "Learn HTML, CSS, JavaScript, React, Node.js and more",
      description:
        "This comprehensive course will take you from beginner to advanced in web development. You'll learn front-end and back-end technologies, build real-world projects, and deploy your applications.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      price: 99.99,
      instructor: instructor1._id,
      category: "Web Development",
      level: "beginner",
      tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      lessonCount: 0, // Sẽ được cập nhật sau
      duration: 0, // Sẽ được cập nhật sau
      rating: 4.8,
      enrollmentCount: 0, // Sẽ được cập nhật sau
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const course2 = new Course({
      title: "Advanced JavaScript Concepts",
      slug: "advanced-javascript-concepts",
      shortDescription: "Master advanced JavaScript concepts and patterns",
      description:
        "Take your JavaScript skills to the next level with this advanced course. Learn about closures, prototypes, async programming, design patterns, and more.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      price: 79.99,
      instructor: instructor1._id,
      category: "JavaScript",
      level: "advanced",
      tags: ["JavaScript", "ES6", "Design Patterns", "Async"],
      lessonCount: 0, // Sẽ được cập nhật sau
      duration: 0, // Sẽ được cập nhật sau
      rating: 4.9,
      enrollmentCount: 0, // Sẽ được cập nhật sau
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const course3 = new Course({
      title: "Data Science Fundamentals",
      slug: "data-science-fundamentals",
      shortDescription: "Learn Python, statistics, and machine learning",
      description:
        "This course covers the fundamentals of data science, including Python programming, statistical analysis, data visualization, and machine learning algorithms.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      price: 89.99,
      instructor: instructor2._id,
      category: "Data Science",
      level: "intermediate",
      tags: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
      lessonCount: 0, // Sẽ được cập nhật sau
      duration: 0, // Sẽ được cập nhật sau
      rating: 4.7,
      enrollmentCount: 0, // Sẽ được cập nhật sau
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await course1.save();
    await course2.save();
    await course3.save();

    // Tạo bài học mẫu cho khóa học 1
    const lessons1 = [
      {
        title: "Introduction to Web Development",
        courseId: course1._id,
        order: 1,
        content:
          "In this lesson, we'll cover the basics of web development and set up our development environment.",
        videoUrl: "https://example.com/videos/lesson1.mp4",
        duration: 30,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "HTML Fundamentals",
        courseId: course1._id,
        order: 2,
        content:
          "Learn the building blocks of web pages with HTML. We'll cover tags, attributes, and document structure.",
        videoUrl: "https://example.com/videos/lesson2.mp4",
        duration: 45,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "CSS Styling",
        courseId: course1._id,
        order: 3,
        content:
          "Make your web pages beautiful with CSS. Learn about selectors, properties, and the box model.",
        videoUrl: "https://example.com/videos/lesson3.mp4",
        duration: 60,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "JavaScript Basics",
        courseId: course1._id,
        order: 4,
        content:
          "Add interactivity to your websites with JavaScript. Learn about variables, functions, and DOM manipulation.",
        videoUrl: "https://example.com/videos/lesson4.mp4",
        duration: 75,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Responsive Web Design",
        courseId: course1._id,
        order: 5,
        content:
          "Make your websites look great on all devices with responsive design techniques.",
        videoUrl: "https://example.com/videos/lesson5.mp4",
        duration: 60,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Tạo bài học mẫu cho khóa học 2
    const lessons2 = [
      {
        title: "JavaScript Closures",
        courseId: course2._id,
        order: 1,
        content:
          "Understanding closures and their practical applications in JavaScript.",
        videoUrl: "https://example.com/videos/js-lesson1.mp4",
        duration: 40,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Prototypal Inheritance",
        courseId: course2._id,
        order: 2,
        content:
          "Deep dive into JavaScript's prototype system and inheritance patterns.",
        videoUrl: "https://example.com/videos/js-lesson2.mp4",
        duration: 50,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Async Programming",
        courseId: course2._id,
        order: 3,
        content:
          "Master promises, async/await, and other asynchronous patterns in JavaScript.",
        videoUrl: "https://example.com/videos/js-lesson3.mp4",
        duration: 65,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Tạo bài học mẫu cho khóa học 3
    const lessons3 = [
      {
        title: "Introduction to Python",
        courseId: course3._id,
        order: 1,
        content: "Getting started with Python programming for data science.",
        videoUrl: "https://example.com/videos/ds-lesson1.mp4",
        duration: 45,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Statistical Analysis",
        courseId: course3._id,
        order: 2,
        content:
          "Learn fundamental statistical concepts and how to apply them in Python.",
        videoUrl: "https://example.com/videos/ds-lesson2.mp4",
        duration: 55,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Data Visualization",
        courseId: course3._id,
        order: 3,
        content:
          "Create compelling visualizations with matplotlib and seaborn.",
        videoUrl: "https://example.com/videos/ds-lesson3.mp4",
        duration: 50,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Introduction to Machine Learning",
        courseId: course3._id,
        order: 4,
        content:
          "Understand the basics of machine learning algorithms and their applications.",
        videoUrl: "https://example.com/videos/ds-lesson4.mp4",
        duration: 70,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Lưu tất cả bài học
    const savedLessons1 = await Lesson.insertMany(lessons1);
    const savedLessons2 = await Lesson.insertMany(lessons2);
    const savedLessons3 = await Lesson.insertMany(lessons3);

    // Cập nhật số lượng bài học và thời lượng cho mỗi khóa học
    course1.lessonCount = lessons1.length;
    course1.duration = lessons1.reduce(
      (total, lesson) => total + lesson.duration,
      0
    );

    course2.lessonCount = lessons2.length;
    course2.duration = lessons2.reduce(
      (total, lesson) => total + lesson.duration,
      0
    );

    course3.lessonCount = lessons3.length;
    course3.duration = lessons3.reduce(
      (total, lesson) => total + lesson.duration,
      0
    );

    // Tạo đăng ký khóa học
    const enrollment1 = new Enrollment({
      userId: student1._id,
      courseId: course1._id,
      progress: 40,
      completedLessons: [savedLessons1[0]._id, savedLessons1[1]._id],
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastAccessDate: new Date(),
      isCompleted: false,
    });

    const enrollment2 = new Enrollment({
      userId: student1._id,
      courseId: course3._id,
      progress: 25,
      completedLessons: [savedLessons3[0]._id],
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastAccessDate: new Date(),
      isCompleted: false,
    });

    const enrollment3 = new Enrollment({
      userId: student2._id,
      courseId: course2._id,
      progress: 66,
      completedLessons: [savedLessons2[0]._id, savedLessons2[1]._id],
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastAccessDate: new Date(),
      isCompleted: false,
    });

    await Promise.all([
      enrollment1.save(),
      enrollment2.save(),
      enrollment3.save(),
    ]);

    // Update enrollment counts
    course1.enrollmentCount += 1;
    course2.enrollmentCount += 1;
    course3.enrollmentCount += 1;

    // Tạo đánh giá khóa học
    const review1 = new Review({
      userId: student1._id,
      courseId: course1._id,
      rating: 5,
      comment:
        "Excellent course! The instructor explains everything clearly and the projects are very practical.",
      createdAt: new Date(),
    });

    const review2 = new Review({
      userId: student2._id,
      courseId: course2._id,
      rating: 4,
      comment:
        "Great advanced content. Some concepts are challenging but well explained.",
      createdAt: new Date(),
    });

    const review3 = new Review({
      userId: student1._id,
      courseId: course3._id,
      rating: 5,
      comment:
        "The data science material is comprehensive and up-to-date. Highly recommended!",
      createdAt: new Date(),
    });

    await review1.save();
    await review2.save();
    await review3.save();

    // Tạo quiz mẫu
    const quiz1 = new Quiz({
      title: "Web Development Fundamentals",
      description: "Test your knowledge of HTML, CSS, and JavaScript basics",
      courseId: course1._id,
      questions: [
        {
          text: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Multi Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language",
          ],
          correctOption: 0,
          explanation:
            "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
        },
        {
          text: "Which CSS property is used to change the text color of an element?",
          options: ["font-color", "text-color", "color", "text-style"],
          correctOption: 2,
          explanation:
            "The 'color' property is used to set the color of text in CSS.",
        },
        {
          text: "Which of the following is NOT a JavaScript data type?",
          options: ["String", "Boolean", "Float", "Object"],
          correctOption: 2,
          explanation:
            "JavaScript has Number type instead of separate Float and Integer types.",
        },
      ],
      timeLimit: 15,
      passingScore: 70,
      createdBy: instructor1._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const quiz2 = new Quiz({
      title: "JavaScript Advanced Concepts",
      description: "Challenge yourself with advanced JavaScript topics",
      courseId: course2._id,
      questions: [
        {
          text: "What is a closure in JavaScript?",
          options: [
            "A function that has access to variables in its outer scope",
            "A way to close a browser window",
            "A method to terminate a function execution",
            "A special type of object",
          ],
          correctOption: 0,
          explanation:
            "A closure is a function that has access to variables in its outer (enclosing) function's scope chain.",
        },
        {
          text: "Which of the following is NOT a JavaScript promise state?",
          options: ["Pending", "Fulfilled", "Rejected", "Cancelled"],
          correctOption: 3,
          explanation:
            "JavaScript promises have three states: pending, fulfilled, and rejected. There is no 'cancelled' state.",
        },
      ],
      timeLimit: 10,
      passingScore: 75,
      createdBy: instructor1._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await quiz1.save();
    await quiz2.save();

    // Tạo sách mẫu
    const book1 = new Book({
      title: "Web Development Handbook",
      author: "John Instructor",
      description:
        "A comprehensive guide to modern web development techniques and best practices.",
      coverImage: "/placeholder.svg?height=300&width=200",
      fileUrl: "#",
      category: "Web Development",
      tags: ["HTML", "CSS", "JavaScript", "React"],
      price: 29.99,
      isFree: false,
      createdBy: instructor1._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const book2 = new Book({
      title: "JavaScript Deep Dive",
      author: "Sarah Teacher",
      description:
        "Explore advanced JavaScript concepts and patterns for professional developers.",
      coverImage: "/placeholder.svg?height=300&width=200",
      fileUrl: "#",
      category: "JavaScript",
      tags: ["JavaScript", "ES6", "Design Patterns"],
      price: 24.99,
      isFree: false,
      createdBy: instructor2._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const book3 = new Book({
      title: "Data Science Essentials",
      author: "Michael Analyst",
      description:
        "Learn the fundamentals of data science, statistics, and machine learning.",
      coverImage: "/placeholder.svg?height=300&width=200",
      fileUrl: "#",
      category: "Data Science",
      tags: ["Python", "Statistics", "Machine Learning"],
      price: 0,
      isFree: true,
      createdBy: instructor2._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await book1.save();
    await book2.save();
    await book3.save();

    // Tạo bài viết blog mẫu
    const blogPost1 = new BlogPost({
      title: "Getting Started with Web Development",
      slug: "getting-started-with-web-development",
      content: `
        <h2>Introduction</h2>
        <p>Web development is an exciting field that combines creativity with technical skills. Whether you're looking to build a personal website, start a career, or just learn something new, web development offers endless possibilities.</p>
        
        <h2>The Basics: HTML, CSS, and JavaScript</h2>
        <p>The foundation of web development consists of three core technologies:</p>
        <ul>
          <li><strong>HTML (HyperText Markup Language)</strong>: The structure of web pages</li>
          <li><strong>CSS (Cascading Style Sheets)</strong>: The presentation and styling</li>
          <li><strong>JavaScript</strong>: The behavior and interactivity</li>
        </ul>
        
        <h2>Getting Started with HTML</h2>
        <p>HTML is the backbone of any website. It's a markup language that defines the structure of your content.</p>
        
        <h2>Adding Style with CSS</h2>
        <p>CSS allows you to make your web pages visually appealing. You can change colors, fonts, layouts, and more.</p>
        
        <h2>Making it Interactive with JavaScript</h2>
        <p>JavaScript adds interactivity to your web pages. You can create animations, validate forms, update content dynamically, and much more.</p>
        
        <h2>Next Steps</h2>
        <p>Once you've learned the basics, you can explore more advanced topics like:</p>
        <ul>
          <li>Responsive design</li>
          <li>CSS frameworks like Bootstrap or Tailwind</li>
          <li>JavaScript frameworks like React, Vue, or Angular</li>
          <li>Backend development with Node.js, Python, or other languages</li>
          <li>Databases and APIs</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Web development is a journey, not a destination. The field is constantly evolving, so continuous learning is key. Start small, build projects, and most importantly, have fun!</p>
      `,
      excerpt:
        "A beginner's guide to starting your journey in web development.",
      coverImage: "/placeholder.svg?height=600&width=1200",
      author: instructor1._id,
      category: "Web Development",
      tags: ["HTML", "CSS", "JavaScript", "Beginners"],
      isPublished: true,
      publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000), // 65 days ago
      updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    });

    const blogPost2 = new BlogPost({
      title: "Advanced JavaScript Techniques",
      slug: "advanced-javascript-techniques",
      content: `
        <h2>Introduction</h2>
        <p>JavaScript has evolved significantly over the years, offering powerful features for modern web development. This post explores some advanced techniques that can take your JavaScript skills to the next level.</p>
        
        <h2>Closures</h2>
        <p>Closures are one of the most powerful features in JavaScript. A closure is a function that has access to its outer function's scope, even after the outer function has returned.</p>
        
        <h2>Promises and Async/Await</h2>
        <p>Asynchronous programming is essential for modern web applications. Promises and async/await syntax make it easier to work with asynchronous operations.</p>
        
        <h2>Functional Programming</h2>
        <p>JavaScript supports functional programming paradigms, allowing for more concise and maintainable code.</p>
        
        <h2>Design Patterns</h2>
        <p>Understanding common design patterns can help you solve recurring problems in your code more efficiently.</p>
        
        <h2>Conclusion</h2>
        <p>Mastering these advanced JavaScript techniques will make you a more effective developer and open up new possibilities in your projects.</p>
      `,
      excerpt:
        "Explore advanced JavaScript patterns and techniques for professional developers.",
      coverImage: "/placeholder.svg?height=600&width=1200",
      author: instructor1._id,
      category: "JavaScript",
      tags: ["JavaScript", "ES6", "Design Patterns", "Advanced"],
      isPublished: true,
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    });

    const blogPost3 = new BlogPost({
      title: "Introduction to Data Science",
      slug: "introduction-to-data-science",
      content: `
        <h2>Introduction</h2>
        <p>Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data.</p>
        
        <h2>The Data Science Process</h2>
        <p>The data science process typically involves several steps:</p>
        <ol>
          <li>Data collection</li>
          <li>Data cleaning and preprocessing</li>
          <li>Exploratory data analysis</li>
          <li>Feature engineering</li>
          <li>Model selection and training</li>
          <li>Model evaluation</li>
          <li>Deployment and monitoring</li>
        </ol>
        
        <h2>Essential Tools and Languages</h2>
        <p>Python and R are the most popular programming languages for data science, along with tools like Jupyter Notebooks, pandas, NumPy, and scikit-learn.</p>
        
        <h2>Getting Started</h2>
        <p>To get started with data science, you should first learn the basics of programming, statistics, and mathematics. Then, practice with real-world datasets and projects.</p>
        
        <h2>Conclusion</h2>
        <p>Data science is a rapidly growing field with applications in virtually every industry. Whether you're interested in machine learning, data analysis, or visualization, there's a place for you in the world of data science.</p>
      `,
      excerpt:
        "Learn the basics of data science and how to get started in this exciting field.",
      coverImage: "/placeholder.svg?height=600&width=1200",
      author: instructor2._id,
      category: "Data Science",
      tags: ["Python", "Statistics", "Machine Learning", "Beginners"],
      isPublished: true,
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    });

    await blogPost1.save();
    await blogPost2.save();
    await blogPost3.save();

    // Cập nhật danh sách khóa học dạy cho giảng viên
    instructor1.teachingCourses = [course1._id, course2._id];
    instructor2.teachingCourses = [course3._id];

    // Cập nhật danh sách khóa học đã đăng ký cho học viên
    student1.enrolledCourses = [course1._id, course3._id];
    student2.enrolledCourses = [course2._id];

    await course1.save();
    await course2.save();
    await course3.save();
    await instructor1.save();
    await instructor2.save();
    await student1.save();
    await student2.save();

    return NextResponse.json({
      message: "Database seeded successfully",
      users: {
        instructors: 2,
        students: 2,
        admins: 1,
        total: 5,
      },
      courses: 3,
      lessons:
        savedLessons1.length + savedLessons2.length + savedLessons3.length,
      enrollments: 3,
      reviews: 3,
      quizzes: 2,
      books: 3,
      blogPosts: 3,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: (error as Error).message },
      { status: 500 }
    );
  }
}
