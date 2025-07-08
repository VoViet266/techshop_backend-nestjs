export class CreateReviewDto {
  userId: string;

  userName: string;

  content: string;

  productId: string;

  rating?: number;
}

export class CreateReplyDto {
  userId: string;

  userName: string;

  content: string;
}
