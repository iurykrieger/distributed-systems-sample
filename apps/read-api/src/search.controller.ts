import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products/:id')
  getById(@Param('id') id: string) {
    return this.searchService.getById(id)
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.searchService.search(query)
  }
}
