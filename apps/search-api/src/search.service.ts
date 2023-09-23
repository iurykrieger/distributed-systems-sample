import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetResponse, SearchResponse, WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async index(product: ProductDto): Promise<WriteResponseBase> {
    try {
      const response = await this.elasticsearchService.index({
        index: 'products',
        id: product.id,
        document: {
          id: product.id,
          name: product.name,
          price: Number.parseFloat(String(product.price)),
          oldPrice: Number.parseFloat(String(product.oldPrice)),
          apiKey: product.apiKey,
          description: product.description,
          createdAt: new Date().toISOString()
        }
      })
      return response
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
