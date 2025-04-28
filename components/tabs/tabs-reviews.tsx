import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Edit, Star, Trash } from "lucide-react";
import ReviewForm from "../reviews/review-form";
import { Review } from "@/lib/data";
import { useRef } from "react";

interface TabsReviewsProps {
  reviews: Review[];
  isEnrolled: boolean;
  user: any;
  userReview: any;
  courseId: string;
  createReviewMutation: any;
  updateReviewMutation: any;
  deleteReviewMutation: any;
}

export default function TabsReviews({
  reviews,
  isEnrolled,
  user,
  userReview,
  courseId,
  createReviewMutation,
  updateReviewMutation,
  deleteReviewMutation,
}: TabsReviewsProps) {
  const dialogRef = useRef<HTMLButtonElement>(null);

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.click();
    }
  };

  return (
    <TabsContent value="reviews" className="mt-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Student Reviews</h3>
          {isEnrolled && (
            <Dialog>
              <DialogTrigger asChild>
                <Button ref={dialogRef}>
                  {userReview ? "Edit Review" : "Add Review"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {userReview ? "Edit Review" : "Write a Review"}
                  </DialogTitle>
                </DialogHeader>
                <ReviewForm
                  courseId={courseId}
                  userId={user?._id}
                  initialData={userReview}
                  onSubmit={(data) => {
                    if (userReview) {
                      updateReviewMutation.mutate(
                        { id: userReview._id, data },
                        {
                          onSuccess: closeDialog,
                        }
                      );
                    } else {
                      createReviewMutation.mutate(data, {
                        onSuccess: closeDialog,
                      });
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet for this course.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review?.userId?.avatar}
                        alt={review?.userId?.name}
                      />
                      <AvatarFallback>
                        {review?.userId?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {review?.userId?.name || "Anonymous"}
                          </h4>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {user?._id === review?.userId?._id && (
                          <div className="mt-2 flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Review</DialogTitle>
                                </DialogHeader>
                                <ReviewForm
                                  courseId={courseId}
                                  userId={user._id}
                                  initialData={{
                                    rating: review.rating,
                                    comment: review.comment,
                                    _id: review._id,
                                  }}
                                  onSubmit={(data) => {
                                    updateReviewMutation.mutate(
                                      { id: review._id, data },
                                      {
                                        onSuccess: closeDialog,
                                      }
                                    );
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                deleteReviewMutation.mutate(review._id)
                              }
                              disabled={deleteReviewMutation.isPending}
                            >
                              {deleteReviewMutation.isPending ? (
                                "Deleting..."
                              ) : (
                                <Trash />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
}
