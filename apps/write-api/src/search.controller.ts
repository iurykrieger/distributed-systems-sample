import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { ProductDto } from './dto/product.dto';
import { IndexService } from './index.service';

@Controller()
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly indexService: IndexService
  ) {} 

  @Post('index')
  async index(@Body() products: ProductDto[]) {
    console.log(`Trying to index ${products.length} products...`)
    await this.searchService.index(products)
    console.log(`Indexed ${products.length} products`)
  }

  @Post('index/all')
  indexAll() {
    this.indexService.indexAll()
  }
}
