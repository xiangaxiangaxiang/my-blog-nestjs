import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = exception instanceof HttpException
            ? exception.getResponse() : {statusCode: status, message: '未知错误'}
        // console.log(exception)
        response.status(status).json(Object.assign({}, {
            message: '',
            data: '',
            statusCode: status
        }, data))
    }
}
