import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
};

export function apiSuccess<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function apiError(message: string, status = 500, errors?: Record<string, string[] | string>) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}

export function apiValidationError(error: ZodError) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      errors: error.flatten().fieldErrors,
    },
    { status: 400 }
  );
}

export function apiNotFound(message = 'Resource not found') {
  return apiError(message, 404);
}

export function apiUnauthorized(message = 'Unauthorized') {
  return apiError(message, 401);
}

export function apiConflict(message = 'Resource already exists') {
  return apiError(message, 409);
}
