import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Repeat2, SendIcon } from "lucide-react";
import { Post } from "@/types/post";
import { CommentService } from "@/services/comment.service";
import { ReactService } from "@/services/react.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "./comment";
import { formatDate } from "@/helper/format-date";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PosterCardProps {
  data: Post;
}

export default function PosterCard({ data }: PosterCardProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const commentService = new CommentService();
  const reactService = new ReactService();

  // Fetch comments
  const { data: comments } = useQuery({
    queryKey: ["comments", data.id],
    queryFn: () => commentService.list(data.id),
  });

  // Fetch reactions
  const { data: reactions } = useQuery({
    queryKey: ["reactions", data.id],
    queryFn: () => reactService.list(data.id, "post"),
  });

  // Add reaction
  const { mutate: addReaction } = useMutation({
    mutationFn: (type: string) =>
      reactService.create({
        entityId: data.id,
        entityType: "post",
        type,
      }),
    onSuccess: () => queryClient.invalidateQueries(["reactions", data.id]),
  });

  const handleLike = () => {
    addReaction("aplaudir");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      await commentService.create({
        postId: data.id,
        content: newComment,
      });
      setNewComment("");
      queryClient.invalidateQueries(["comments", data.id]);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={data.user?.imgUrl} alt={data.user.fullName} />
          <AvatarFallback>{data.user.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{data.user?.fullName}</p>
          <p className="text-sm text-muted-foreground">{data.user?.bio}</p>
        </div>
        <p className="ml-auto text-sm text-muted-foreground">{formatDate(data.createdAt)}</p>
      </CardHeader>
      <CardContent>
        <p>{data.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex w-full justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleLike}>
                  <Heart className={`mr-2 h-4 w-4 ${reactions && reactions?.length > 0 ? "text-rose-500" : "bg-transparent"}`} fill={reactions && reactions?.length > 0 ? "#f43f5e" : ""} />
                  {reactions?.filter((r) => r.reactionType === "aplaudir").length ?? 0}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {
                  reactions?.map((react) => (
                    <p key={react.entityId}>{react.userFullName}</p>

                  ))
                }

              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {comments?.length ?? 0}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {
                  comments?.map((comment) => (
                    <p key={comment.id}>{comment.fullName}</p>

                  ))
                }

              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


          <Button variant="ghost" size="sm">
            <Repeat2 className="mr-2 h-4 w-4" />
            Repost
          </Button>
        </div>
        <form onSubmit={handleAddComment} className="flex w-full gap-2">

          <div className="w-full relative flex justify-between gap-2">
            <Input
              placeholder="Write comments here......."
              className="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <Button type="submit" variant={"ghost"} className="absolute right-0 top-0">
              <SendIcon />
            </Button>
          </div>

        </form>
        {comments?.map((comment) => (
          <div key={comment.id} className="flex flex-col divide-y divide-zinc-200 w-full">
            <Comment comment={comment} />
          </div>

        ))}

      </CardFooter>
    </Card>
  );
}
