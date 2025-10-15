export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE',
  }
  
export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: number;
  active: boolean;
  commerceId: number;
  role: UserRole;
  avatar?: string;
}
