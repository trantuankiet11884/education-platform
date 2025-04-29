import React, { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";

interface ReviewFormProps {
  isLoading: boolean;
  courseId: string;
  userId?: string;
  onSubmit: (data: { rating: number; comment: string }) => void;
  initialData?: { rating: number; comment: string; _id: string };
}

export default function ReviewForm({
  isLoading,
  courseId,
  userId,
  onSubmit,
  initialData,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            {isSubmitting ? (
              <>
                <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>{initialData ? "Update Review" : "Submit Review"}</>
            )}
          </>
        )}
      </Button>
    </form>
  );
}
