"use client";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import MainNav from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export interface IBook {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().url("Must be a valid URL"),
  fileUrl: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((tag) => tag.trim()) : [])),
  price: z.number().min(0, "Price must be a positive number"),
  isFree: z.boolean().default(false),
  createdBy: z.string(),
});

// Type for the form data
type BookFormValues = z.infer<typeof bookFormSchema>;

export function BookFormPage({ bookId }: { bookId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!bookId;
  const { user } = useAuth();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      coverImage: "",
      fileUrl: "",
      category: "",
      tags: [],
      price: 0,
      isFree: false,
      createdBy: user?._id,
    },
  });

  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const response = await axios.get(`/api/books/${bookId}`);
      return response.data;
    },
    enabled: isEdit || !!bookId,
  });

  useEffect(() => {
    if (isEdit && book) {
      form.reset({
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: book.coverImage,
        fileUrl: book.fileUrl,
        category: book.category,
        tags: book.tags.join(", "),
        price: book.price,
        isFree: book.isFree,
      });
    }
  }, [book, isEdit, form]);

  const createMutation = useMutation({
    mutationFn: (data: BookFormValues) => axios.post("/api/books", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-books"] });
      router.push("/teacher/books");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BookFormValues) =>
      axios.put(`/api/books/${bookId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-books"] });
      router.push("/teacher/books");
    },
  });

  const onSubmit = (data: BookFormValues) => {
    const finalData = {
      ...data,
      price: data.isFree ? 0 : data.price,
    };
    if (isEdit) {
      updateMutation.mutate(finalData);
    } else {
      createMutation.mutate(finalData);
    }
  };

  if (isEdit && isBookLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Icons.logo className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 p-2">
        <div className="container py-12 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? "Edit Book" : "Create New Book"}</CardTitle>
              <CardDescription>
                {isEdit
                  ? "Update book details"
                  : "Add a new book to your collection"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Book title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Book description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/cover.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/book.pdf"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fiction">Fiction</SelectItem>
                            <SelectItem value="Non-Fiction">
                              Non-Fiction
                            </SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Biography">Biography</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tags separated by commas"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Free Book</FormLabel>
                          <FormDescription>
                            Mark this book as free (price will be set to 0)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {!form.watch("isFree") && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex gap-4">
                    <Link href={"/teacher/books"}>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      onClick={() => onSubmit(form.getValues())}
                    >
                      {isEdit
                        ? updateMutation.isPending
                          ? "Updating..."
                          : "Update Book"
                        : createMutation.isPending
                        ? "Creating..."
                        : "Create Book"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
