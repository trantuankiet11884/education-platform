"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Sử dụng API thực tế
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: booksApi.getAll,
  });

  // Get unique categories
  const categories = Array.from(new Set(books.map((book) => book.category)));

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && book.isFree) ||
      (priceFilter === "paid" && !book.isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Exam Preparation Books
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover our collection of books to help you prepare for exams
                  and advance your knowledge.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Icons.logo className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No books found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBooks.map((book) => (
                    <Card
                      key={book._id}
                      className="flex flex-col overflow-hidden"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="object-cover w-full h-full transition-all hover:scale-105"
                        />
                        {book.isFree && (
                          <Badge className="absolute top-2 right-2 bg-green-600">
                            Free
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle>{book.title}</CardTitle>
                        <CardDescription>by {book.author}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground mb-4">
                          {book.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {book.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div>
                          {book.isFree ? (
                            <span className="text-green-600 font-medium">
                              Free
                            </span>
                          ) : (
                            <span className="font-medium">
                              ${book.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Link href={`/books/${book._id}`}>
                          <Button>View Details</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
