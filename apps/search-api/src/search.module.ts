import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      maxListeners: 9999999,
      verboseMemoryLeak: false,
      ignoreErrors: true 
    }),
    ElasticsearchModule.register({
      node: process.env.ELASTIC_SEARCH_URL
    })
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class AppModule {}
