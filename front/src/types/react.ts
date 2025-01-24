export interface Reaction {
    id: number;
    entityId: number;
    entityType: string;
    userId: number;
    type: string;
  }

  export interface AddReactionRequest {
    entityId: number;
    entityType: string;
    type: string;
  }