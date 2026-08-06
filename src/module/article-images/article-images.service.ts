import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleImage } from './entities/article-image.entity';
import { Article } from '../articles/entities/article.entity';
import { CreateArticleImageDto } from './dto/create-article-image.dto';

@Injectable()
export class ArticleImagesService {
  constructor(
    @InjectRepository(ArticleImage)
    private articleImageRepo: Repository<ArticleImage>,
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
  ) {}

  async create(
    createArticleImageDto: CreateArticleImageDto,
    files: Express.Multer.File[],
  ) {
    const foundedArticles = await this.articleImageRepo.find({
      where: { article: { id: createArticleImageDto.articleId } },
    });

    if (foundedArticles.length + files.length > 10) {
      throw new BadRequestException('Limit has been exceeded');
    }

    let order = foundedArticles.length + 1;
    const result: ArticleImage[] = [];

    for (const element of files) {
      const articleDetails = this.articleImageRepo.create({
        article: { id: createArticleImageDto.articleId },
      });
      articleDetails.sortOrder = order;          
      articleDetails.url = `http://localhost:4001/uploads/${element.filename}`;
      order++;

      result.push(articleDetails);
    }

    return this.articleImageRepo.save(result);
  }

  async findAll(query: Record<string, any>) {
    const { page = 1, limit = 10 } = query;

    const [result, total] = await this.articleImageRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC' },
      relations: { article: true },
    });

    return {
      total,
      prev: page > 1 ? { page: +page - 1, limit } : undefined,
      next: total > page * limit ? { page: +page + 1, limit } : undefined,
      result,
    };
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} articleImage`;
  // }

  // update(id: number, updateArticleImageDto: UpdateArticleImageDto) {
  //   return `This action updates a #${id} articleImage`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} articleImage`;
  // }
}
