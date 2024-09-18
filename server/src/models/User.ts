export interface IUser {
  id: number;
  user_name: string;
  email: string;
  hashed_password: string;
  created_at: Date;
}
