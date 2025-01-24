import { api } from "@/lib/axios";
import { Comment } from "@/types/comment";

export interface CreateCommentRequest {
    postId: number;
    content: string;
  }

export class CommentService{

    async list  (postId: number): Promise<Comment[]> {
        const response = await api.get<Comment[]>(`/comments/${postId}`);
        return response.data;
      };
      
      async create (
        data: CreateCommentRequest,
      ): Promise<Comment>  {
        const response = await api.post<Comment>('/comments', data);
        return response.data;
      };

}