import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res.hasOwnProperty('message')) {
        const msg = (res as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const customResponse = new ResponseDto(status, message, null);
    response.status(status).json(customResponse);
  }
}
