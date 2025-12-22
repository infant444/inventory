export type UserRole = "admin" | "manager" | "staff";
export type UserType = UserRole; // Alias for Prisma compatibility

export class User {
  user_id!: string;
  full_name!: string;
  email!: string;
  phone?: string;
  password!: string;
  role!: UserRole;
  is_active!: boolean;
  email_notification!: boolean;
  location_ids?: string[];
}