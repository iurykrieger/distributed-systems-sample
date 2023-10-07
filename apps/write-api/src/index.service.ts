import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as es from 'event-stream'
import { SearchService } from './search.service';
import { ProductDto } from './dto/product.dto';
import { backOff } from "exponential-backoff";

@Injectable()
export class IndexService {
    private readonly logger = new Logger(SearchService.name)
    private readonly CHUNK_SIZE = 100
    private readonly BASE_DIR = './data/products'

    constructor(
        private readonly searchService: SearchService
    ) { }

    async indexAll() {
        const productsDir = readdirSync(this.BASE_DIR)

        for (const file of productsDir) {
            await this.readProductsFileByChunks(`${this.BASE_DIR}/${file}`, async products =>
                this.searchService.index(products))
        }
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
                await this.retryNTimes(() => callback(chunk))
                chunk = []
            }
        })
    }

    private async retryNTimes(callback: () => Promise<void>, attempt = 1, times = 5): Promise<void> {
        try {
            await callback()
        } catch (error) {
            if (attempt >= times) {
                this.logger.error(error)
                return
            }

            this.logger.warn("Too many requests!", error)
            this.logger.warn(`Attempt number ${attempt}...`)
            await this.sleep(5000)
            return this.retryNTimes(callback, attempt + 1)
        }
    }

    private sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
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