"use client";

import { useState } from "react";
import type { Comment as CommentProps } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/helper/format-date";
import { ReactService } from "@/services/react.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

type Props = {
  comment: CommentProps;
};

export function Comment({ comment }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const reactService = new ReactService();

  const { data: reactions = [] } = useQuery({
    queryKey: ["reactions", comment.id],
    queryFn: () => reactService.list(comment.id, "comment"),
  });

  const { mutate: toggleReaction } = useMutation({
    mutationFn: (type: string) =>
      reactService.create({
        entityId: comment.id,
        entityType: "comment",
        type,
      }),
    onSuccess: () => queryClient.invalidateQueries(["reactions", comment.id]),
  });

  const handleLike = () => {
    toggleReaction("aplaudir");
  };

  // Contagem de reações do tipo "aplaudir"
  const applauseCount = reactions.filter((reaction) => reaction.type === "aplaudir").length;

  // Verificar se o usuário já reagiu com "aplaudir"
  const userReacted = reactions.some(
    (reaction) => reaction.type === "aplaudir" && reaction.userId === "currentUserId" // Substituir por lógica para pegar o ID do usuário atual
  );

  return (
    <article className="w-full flex flex-col gap-8">
      <div className="w-full p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.imgUrl} alt={comment.fullName} />
              <AvatarFallback>{comment.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h5 className="text-gray-900 text-sm font-semibold">
                {comment.fullName}
              </h5>
              <time
                dateTime={comment.createdAt}
                className="text-gray-500 text-xs"
              >
                {formatDate(comment.createdAt)}
              </time>
            </div>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Save</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Comment Content */}
        <div>
          <p
            className={`text-gray-800 text-sm ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {comment.content}
          </p>
          {comment.content.length > 100 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2"
            >
              {isExpanded ? "View less" : "View more"}
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          {/* Reactions Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {/* <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    userReacted ? "text-rose-500" : ""
                  }`}
                  fill={userReacted ? "#f43f5e" : ""}
                />
                {applauseCount}
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
