import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { IndexService } from './index.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTIC_SEARCH_URL
    })
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    IndexService
  ],
})
export class AppModule {}
