"use client";

import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { coursesApi, quizzesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-provider";
import {
  Course,
  CSVQuestion,
  JSONQuestion,
  PaginatedResponse,
  QuizFormState,
} from "@/types/quiz";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Download, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

export default function CreateQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<QuizFormState>({
    title: "",
    description: "",
    courseId: "",
    timeLimit: 0,
    passingScore: 0,
    questions: [
      {
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
        explanation: "",
      },
    ],
  });

  const { data: coursesData = [], isLoading } = useQuery({
    queryKey: ["teacher-courses", user?._id],
    queryFn: async () => {
      const response = await axios.get(`/api/courses/instructor/${user?._id}`);
      return response.data.data || [];
    },
    enabled: !!user && user.role === "teacher",
  });

  const createQuizMutation = useMutation({
    mutationFn: (newQuiz: any) =>
      quizzesApi.create({ ...newQuiz, createdBy: user?._id }),
    onSuccess: () => {
      toast({ title: "Quiz created successfully" });
      router.push("/teacher/quizzes");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuizMutation.mutate(quiz);
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctOption: 0,
          explanation: "",
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (quiz.questions.length > 1) {
      const newQuestions = [...quiz.questions];
      newQuestions.splice(index, 1);
      setQuiz({ ...quiz, questions: newQuestions });
    } else {
      toast({
        title: "Cannot remove last question",
        description: "Quiz must have at least one question",
        variant: "destructive",
      });
    }
  };

  // Handle file upload for CSV or JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse<CSVQuestion>(file, {
        complete: (result) => {
          const parsedQuestions = result.data
            .filter((row) => row.question_text)
            .map((row) => ({
              text: row.question_text,
              options: [row.option1, row.option2, row.option3, row.option4],
              correctOption: Number(row.correct_option) - 1,
              explanation: row.explanation || "",
            }));
          setQuiz({ ...quiz, questions: parsedQuestions });
          toast({ title: "Questions imported successfully from CSV" });
        },
        header: true,
        skipEmptyLines: true,
        error: () => {
          toast({
            title: "Error parsing CSV",
            description: "Please check the CSV file format and try again.",
            variant: "destructive",
          });
        },
      });
    } else if (fileExtension === "json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(
            event.target?.result as string
          ) as JSONQuestion[];
          const parsedQuestions = jsonData.map((q) => ({
            text: q.text,
            options: q.options,
            correctOption: Number(q.correctOption),
            explanation: q.explanation || "",
          }));
          setQuiz({ ...quiz, questions: parsedQuestions });
          toast({ title: "Questions imported successfully from JSON" });
        } catch (error) {
          toast({
            title: "Error parsing JSON",
            description: "Please check the JSON file format and try again.",
            variant: "destructive",
          });
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error reading JSON file",
          description: "Please try again with a valid JSON file.",
          variant: "destructive",
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported file format",
        description: "Please upload a CSV or JSON file.",
        variant: "destructive",
      });
    }
  };

  // Create and download sample CSV
  const handleDownloadSampleCSV = () => {
    const sampleCSV = `question_text,option1,option2,option3,option4,correct_option,explanation
"What is 2 + 2?","2","3","4","5",3,"2 + 2 equals 4."
"What is the capital of France?","Paris","London","Berlin","Madrid",1,"Paris is the capital of France."
"Who wrote Romeo and Juliet?","Charles Dickens","William Shakespeare","Jane Austen","Mark Twain",2,"William Shakespeare is the author."`;

    const blob = new Blob([sampleCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_questions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create and download sample JSON
  const handleDownloadSampleJSON = () => {
    const sampleJSON = [
      {
        text: "What is 2 + 2?",
        options: ["2", "3", "4", "5"],
        correctOption: 2,
        explanation: "2 + 2 equals 4.",
      },
      {
        text: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctOption: 0,
        explanation: "Paris is the capital of France.",
      },
      {
        text: "Who wrote Romeo and Juliet?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        correctOption: 1,
        explanation: "William Shakespeare is the author.",
      },
    ];

    const blob = new Blob([JSON.stringify(sampleJSON, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_questions.json");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Icons.logo className="h-8 w-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "teacher") {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center p-6">
            <CardHeader>
              <CardTitle className="text-red-500">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Only teachers can create quizzes. Please sign in with a teacher
                account.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/")}>Go to Home</Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-8 px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Create New Quiz</h1>
            <Button
              onClick={() => router.push("/teacher/quizzes")}
              variant="outline"
            >
              Back to Quizzes
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Quiz Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Information</CardTitle>
                <CardDescription>Basic details about your quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input
                      id="title"
                      value={quiz.title}
                      onChange={(e) =>
                        setQuiz({ ...quiz, title: e.target.value })
                      }
                      placeholder="Enter quiz title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={quiz.courseId}
                      onValueChange={(value) =>
                        setQuiz({ ...quiz, courseId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">None</SelectItem>
                          {coursesData.map((course: Course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={quiz.description}
                    onChange={(e) =>
                      setQuiz({ ...quiz, description: e.target.value })
                    }
                    placeholder="Describe what this quiz is about"
                    className="min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="timeLimit"
                            type="number"
                            value={quiz.timeLimit || ""}
                            onChange={(e) =>
                              setQuiz({
                                ...quiz,
                                timeLimit: Number(e.target.value),
                              })
                            }
                            min="0"
                            placeholder="Enter time limit (0 for no limit)"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set to 0 for unlimited time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="passingScore"
                            type="number"
                            value={quiz.passingScore || ""}
                            onChange={(e) =>
                              setQuiz({
                                ...quiz,
                                passingScore: Number(e.target.value),
                              })
                            }
                            min="0"
                            max="100"
                            placeholder="Enter passing score percentage"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum percentage required to pass this quiz</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Questions</CardTitle>
                <CardDescription>
                  Add questions manually or import from a file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="import">Import Questions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4">
                    <Accordion
                      type="multiple"
                      defaultValue={["question-0"]}
                      className="space-y-4"
                    >
                      {quiz.questions.map((q, qIndex) => (
                        <AccordionItem
                          key={qIndex}
                          value={`question-${qIndex}`}
                          className="border rounded-lg"
                        >
                          <AccordionTrigger className="px-4 py-2 hover:no-underline">
                            <div className="flex justify-between w-full items-center">
                              <span className="font-medium">
                                Question {qIndex + 1}
                                {q.text &&
                                  `: ${q.text.substring(0, 30)}${
                                    q.text.length > 30 ? "..." : ""
                                  }`}
                              </span>
                              <div
                                // variant="ghost"
                                // size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeQuestion(qIndex);
                                }}
                                className="hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-3"
                              >
                                <Trash2 className="h-4 w-4" />
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-3 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`question-text-${qIndex}`}>
                                Question Text
                              </Label>
                              <Textarea
                                id={`question-text-${qIndex}`}
                                value={q.text}
                                onChange={(e) => {
                                  const newQuestions = [...quiz.questions];
                                  newQuestions[qIndex].text = e.target.value;
                                  setQuiz({ ...quiz, questions: newQuestions });
                                }}
                                placeholder="Enter your question"
                                className="min-h-16"
                                required
                              />
                            </div>

                            <div className="space-y-4">
                              <Label>Answer Options</Label>
                              {q.options.map((option, oIndex) => (
                                <div
                                  key={oIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <div className="flex-grow">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newQuestions = [
                                          ...quiz.questions,
                                        ];
                                        newQuestions[qIndex].options[oIndex] =
                                          e.target.value;
                                        setQuiz({
                                          ...quiz,
                                          questions: newQuestions,
                                        });
                                      }}
                                      placeholder={`Option ${oIndex + 1}`}
                                      required
                                      className={
                                        q.correctOption === oIndex
                                          ? "border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20"
                                          : ""
                                      }
                                    />
                                  </div>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          // variant={
                                          //   q.correctOption === oIndex
                                          //     ? "default"
                                          //     : "outline"
                                          // }
                                          // size="sm"
                                          onClick={() => {
                                            const newQuestions = [
                                              ...quiz.questions,
                                            ];
                                            newQuestions[qIndex].correctOption =
                                              oIndex;
                                            setQuiz({
                                              ...quiz,
                                              questions: newQuestions,
                                            });
                                          }}
                                          className={`inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-3 ${
                                            q.correctOption === oIndex
                                              ? `bg-primary text-primary-foreground hover:bg-primary/90`
                                              : `border border-input bg-background hover:bg-accent hover:text-accent-foreground`
                                          } `}
                                        >
                                          {q.correctOption === oIndex
                                            ? "Correct"
                                            : "Set Correct"}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Mark this as the correct answer</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`explanation-${qIndex}`}>
                                Explanation (Optional)
                              </Label>
                              <Textarea
                                id={`explanation-${qIndex}`}
                                value={q.explanation}
                                onChange={(e) => {
                                  const newQuestions = [...quiz.questions];
                                  newQuestions[qIndex].explanation =
                                    e.target.value;
                                  setQuiz({ ...quiz, questions: newQuestions });
                                }}
                                placeholder="Explain why the correct answer is right (shown after submission)"
                                className="min-h-16"
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addQuestion}
                        className="flex items-center"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="import" className="space-y-6">
                    <Card className="border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="flex flex-col items-center justify-center py-4">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="mb-2 text-sm font-medium">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Supported formats: CSV, JSON
                          </p>
                          <Input
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileUpload}
                            className="max-w-sm"
                          />
                        </div>
                      </CardContent>
                      <Separator />
                      <CardFooter className="flex justify-between p-4">
                        <div className="text-sm text-muted-foreground">
                          <FileText className="inline h-4 w-4 mr-1" />
                          Need a template?
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadSampleCSV}
                            className="flex items-center"
                          >
                            <Download className="mr-1 h-4 w-4" /> Sample CSV
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadSampleJSON}
                            className="flex items-center"
                          >
                            <Download className="mr-1 h-4 w-4" /> Sample JSON
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>

                    <div className="text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">File Formats:</h4>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">CSV format:</span>{" "}
                          question_text,option1,option2,option3,option4,correct_option,explanation
                        </p>
                        <p>
                          <span className="font-medium">JSON format:</span> [
                          {"{"} text, options, correctOption, explanation {"}"}
                          ,...]
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <Card>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Total Questions: {quiz.questions.length}
                    </p>
                    {!quiz.title && (
                      <p className="text-sm text-red-500 mt-1">
                        Quiz title is required
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/teacher/quizzes")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createQuizMutation.isPending || !quiz.title}
                    >
                      {createQuizMutation.isPending ? (
                        <>
                          <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Quiz"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
