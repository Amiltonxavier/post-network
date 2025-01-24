import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Smile, Calendar } from "lucide-react";
import { PostService } from "@/services/post.service";
import { queryClient } from "@/lib/react-query";

import { useUser } from "@/context/user.context";

export function CreatePost() {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const postService = new PostService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim(); // Remover espaços extras
    if (trimmedContent) {
      try {
        await postService.create({ content: trimmedContent });
        setContent(""); // Resetar o campo após envio
        queryClient.invalidateQueries(["list-post"]); // Atualizar a lista de posts
      } catch (error) {
        console.error("Erro ao criar post:", error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mb-4">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={user?.imgUrl} alt={user?.fullName} />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder={`O que você está pensando, ${user?.fullName}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-grow resize-none"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="icon">
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <Button type="submit" disabled={!content.trim()}>
            Postar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
