import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { IndexService } from './index.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTIC_SEARCH_URL,
      auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASSWORD,
      },
      tls: {
        ca: process.env.ELASTIC_CERTIFICATE,
        rejectUnauthorized: false,
      }
    })
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    IndexService
  ],
})
export class AppModule { }
