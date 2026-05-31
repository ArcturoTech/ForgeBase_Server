import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface Response<T> {
    data: T;
    timestamp: string;
}
export declare class TransformInterceptor<T> implements NestInterceptor<T, Response<T> | T> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T> | T>;
}
