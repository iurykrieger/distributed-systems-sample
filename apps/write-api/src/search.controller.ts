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
  index(@Body() product: ProductDto) {
    return this.searchService.index([product])
  }

  @Post('index/all')
  indexAll() {
    this.indexService.indexAll()
  }
}
