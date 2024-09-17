export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface ErrorResponse {
  error: string;
}
