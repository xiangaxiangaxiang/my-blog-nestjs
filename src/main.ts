import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AllExceptionsFilter } from './filters/Exceptions.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(new ValidationPipe())
    app.setGlobalPrefix('api')
    app.use(helmet())
    app.useGlobalFilters(new AllExceptionsFilter())
    app.use(cookieParser())

    await app.listen(3000);
}
bootstrap();
