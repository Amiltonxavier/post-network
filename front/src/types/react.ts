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

  export interface ReactionWithUser {
    reactionId: number; // ID da reação
    reactionType: string; // Tipo da reação (like, dislike, etc.)
    entityId: number; // ID da entidade associada à reação
    entityType: string; // Tipo da entidade associada (ex: post, comment)
    userId: number; // ID do usuário que reagiu
    userFullName: string; // Nome completo do usuário
    userImgUrl: string | null; // URL da imagem de perfil do usuário
  }