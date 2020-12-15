export interface UserReponse {
  id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly userName: string;
  readonly email: string;
  readonly hashPassword: string;
  readonly userStatus: string;
}
