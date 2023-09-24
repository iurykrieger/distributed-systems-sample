import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { ProductDto } from './dto/product.dto';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('index')
  index(@Body() product: ProductDto) {
    return this.searchService.index(product)
  }
}
