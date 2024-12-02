import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { ConflictError, NotFoundError, ValidationError } from '../errors/errors'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) =>
        throwError(() => {
          if (error instanceof NotFoundError) {
            console.info(error)
            return new NotFoundException(error.message)
          }

          if (error instanceof ConflictError) {
            console.info(error)
            return new ConflictException(error.message)
          }

          if (error instanceof ValidationError) {
            console.info(error)
            return new BadRequestException(error.message)
          }

          if (error instanceof HttpException) {
            console.warn(error)
            return error
          }

          console.error(error)
          return new InternalServerErrorException()
        }),
      ),
    )
  }
}
