import { BookFormPage } from "@/components/books/book-form";

type EditBookProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookPage({ params }: EditBookProps) {
  return <BookFormPage bookId={(await params).id} />;
}
