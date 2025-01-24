import { api } from "@/lib/axios";
import { AddReactionRequest, Reaction } from "@/types/react";

export class ReactService {
    async list (
        entityId: number,
        entityType: string,
      ): Promise<Reaction[]>  {
        const response = await api.get<Reaction[]>(
          `/reactions/${entityId}/${entityType}`
         
        );
        return response.data;
      };
      
      async create (
        data: AddReactionRequest,
      ): Promise<string>  {
        const response = await api.post<{ message: string }>('/reactions', data);
        return response.data.message;
      };
}