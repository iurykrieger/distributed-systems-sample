import { NestFactory } from '@nestjs/core';
import { AppModule } from './search.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import metricsPlugin from 'fastify-metrics' 

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await app.register(metricsPlugin, { endpoint: '/metrics' })
  await app.listen(3000, '0.0.0.0'); 
}
bootstrap();
