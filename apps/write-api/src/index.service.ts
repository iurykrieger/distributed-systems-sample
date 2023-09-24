import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as es from 'event-stream'
import { ProductDto } from '../../read-api/src/dto/product.dto';
import { SearchService } from './search.service';


@Injectable()
export class IndexService {
    private readonly logger = new Logger(SearchService.name)
    private readonly CHUNK_SIZE = 300
    private readonly BASE_DIR = './data/products'

    constructor(
        private readonly searchService: SearchService
    ) { }

    async indexAll() {
        const productsDir = readdirSync(this.BASE_DIR)

        await Promise.all(productsDir.map(file =>
            this.readProductsFileByChunks(`${this.BASE_DIR}/${file}`, products =>
                this.searchService.index(products)
            )
        ))
    }

    private async readFileByLine(filePath: string, callback: (line: string) => Promise<void>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            createReadStream(join(process.cwd(), filePath), { encoding: 'utf-8' })
                .pipe(es.split())
                .pipe(es.mapSync((line: string) => callback(line)))
                .on('error', reject)
                .on('end', resolve)
        })
    }

    private async readProductsFileByChunks(filePath: string, callback: (chunk: ProductDto[]) => Promise<void>): Promise<void> {
        let chunk: ProductDto[] = []
        await this.readFileByLine(filePath, async (line: string) => {
            const product = this.parseProduct(line)
            chunk.push(product)

            if (chunk.length % this.CHUNK_SIZE === 0) {
                await callback(chunk)
                chunk = []
            }
        })
    }

    private parseProduct(data: any): ProductDto {
        if (!data) {
            return
        }

        const product: ProductDto = JSON.parse(data)

        product.price = Number.parseFloat(product.price?.toString())
        product.oldPrice = Number.parseFloat(product.oldPrice?.toString())

        return product
    }
}