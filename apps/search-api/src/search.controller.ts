import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ProductDto } from './dto/product.dto';
import { IndexService } from './index.service';

@Controller()
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly indexService: IndexService
  ) {}

  @Post('index/all')
  indexAll() {
    this.indexService.indexAll()
  }

  @Post('index')
  index(@Body() product: ProductDto) {
    return this.searchService.index([product])
  }

  @Get('products/:id')
  getById(@Param('id') id: string) {
    return this.searchService.getById(id)
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.searchService.search(query)
  }
}
