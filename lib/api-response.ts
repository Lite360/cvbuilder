export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, error?: any): ApiResponse {
  return {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  };
}
