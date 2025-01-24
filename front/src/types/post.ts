import { userType } from "@/schema/user.schema";

export interface Post {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    user: userType
  }