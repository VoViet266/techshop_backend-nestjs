export class Banner {
  title: string;
  description: string;
  imageUrl: string;
  linkTo: string;
  position: string; // e.g., 'top', 'bottom', 'sidebar'
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    _id: string; // Assuming _id is a string, adjust if it's an ObjectId
    email: string;
  };
  updatedBy: {
    _id: string; // Assuming _id is a string, adjust if it's an ObjectId
    email: string;
  };
}
