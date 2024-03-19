import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

// Define a response structure
export interface Response<T> {
  message: string;
  success: boolean;
  result: any;
  error: null;
  timestamps: Date;
  statusCode: number;
}

// Define a custom interceptor
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  // Intercept method to modify responses
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Extract status code and path from the context
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;

    // Handle the observable stream
    return next.handle().pipe(
      map((data) => ({
        // Transform the response data
        message: data.message,
        success: data.success,
        result: data.result,
        timestamps: new Date(),
        statusCode,
        path,
        error: null,
      })),
    );
  }
}
