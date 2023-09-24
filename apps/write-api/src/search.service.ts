import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';

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
}
