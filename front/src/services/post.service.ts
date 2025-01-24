import { api } from "@/lib/axios";
import { Post } from "@/types/post";

export interface CreatePostRequest {
    content: string;
  }

export class PostService {
    async list (): Promise<Post[]> {
        const response = await api.get<Post[]>('/posts');
        return response.data;
      };
      
      async create (
        data: CreatePostRequest,
      ): Promise<Post> {
        const response = await api.post<Post>('/posts', data, {

        });
        return response.data;
      };
}