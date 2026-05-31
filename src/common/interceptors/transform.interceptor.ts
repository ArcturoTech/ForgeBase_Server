import {
  CallHandler, ExecutionContext,
  Injectable, NestInterceptor,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T> | T> {
    if (context.getType<GqlContextType>() === 'graphql') {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
