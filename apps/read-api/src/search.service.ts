import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetResponse, SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getById(id: string): Promise<GetResponse<ProductDto>> {
    try {
      const response = await this.elasticsearchService.get<ProductDto>({
        index: 'products',
        id
      })
      return response
    } catch (error) {
      this.logger.error(error)
      throw new BadRequestException(error)
    }
  }

  async search(query: string): Promise<SearchResponse<ProductDto>> {
    try {
      this.logger.log(`Incoming search with query "${query}"`)
      const response = await this.elasticsearchService.search<ProductDto>({
        query: {
          match: {
            name: query 
          }
        }
      })
      this.logger.log(`Took ${response.took}ms to found results for query "${query}"`)
      return response
    } catch (error) {
      this.logger.error(error)
      throw new BadRequestException(error)
    }
  }
}
