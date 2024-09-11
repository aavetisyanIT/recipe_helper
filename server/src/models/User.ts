export interface IUser {
  UserID: number;
  Username: string;
  Email: string;
  HashedPassword: string;
  CreatedAt?: Date;
}
