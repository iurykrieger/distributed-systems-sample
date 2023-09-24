import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetResponse, SearchResponse, WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async index(products: ProductDto[]): Promise<void> {
    try {
      await this.elasticsearchService.bulk({
        index: 'products',
        operations: products.flatMap(product => [
          {
            index: { _index: 'products' }
          },
          {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            apiKey: product.apiKey,
            description: product.description,
            createdAt: new Date().toISOString()
          }
        ])
      })
    } catch (error) {
      this.logger.error(error)
      throw new BadRequestException(error)
    }
  }

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
      const response = await this.elasticsearchService.search<ProductDto>({
        query: {
          match: {
            name: query 
          }
        }
      })
      return response
    } catch (error) {
      this.logger.error(error)
      throw new BadRequestException(error)
    }
  }
}
