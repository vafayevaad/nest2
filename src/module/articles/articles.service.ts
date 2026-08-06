import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Article } from './entities/article.entity';
import { Tag } from '../tag/entities/tag.entity';
import { ArticleImage } from '../article-images/entities/article-image.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    @InjectRepository(ArticleImage)
    private articleImageRepo: Repository<ArticleImage>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    files: Express.Multer.File[],
  ) {
    const [coverImage, ...galleryImages] = files ?? [];

    const article = this.articleRepo.create({
      title: createArticleDto.title,
      text: createArticleDto.text,
      backgroundImage: coverImage
        ? `http://localhost:4001/uploads/${coverImage.filename}`
        : undefined,
    });

    if (createArticleDto.tags) {
      const foundedTags = await this.tagRepo.findBy({
        id: In(createArticleDto.tags),
      });
      article.tags = foundedTags;
    }

    const savedArticle = await this.articleRepo.save(article);

    if (galleryImages.length) {
      let order = 1;
      const images = galleryImages.map((file) => {
        const image = this.articleImageRepo.create({
          article: { id: savedArticle.id },
        });
        image.sortOrder = order++;
        image.url = `http://localhost:4001/uploads/${file.filename}`;
        return image;
      });

      await this.articleImageRepo.save(images);
    }

    return savedArticle;
  }

  async findAll(queryDto: QueryDto) {
    const { search, page = 1, limit = 10 } = queryDto;

    const myQuery = this.articleRepo.createQueryBuilder('article');

    if (search) {
      myQuery.andWhere(
        `article.title ILIKE :search OR article.text ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    const result = await myQuery
      .orderBy('article.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const total = await myQuery.getCount();

    return {
      total,
      prev: page > 1 ? { page: page - 1, limit } : undefined,
      next: total > page * limit ? { page: +page + 1, limit } : undefined,
      result,
    };
  }

  async findOne(id: number) {
    const foundedArticle = await this.articleRepo.findOne({
      where: { id },
      relations: { tags: true },
    });

    if (!foundedArticle) {
      throw new NotFoundException('Article not found');
    }

    return foundedArticle;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: { tags: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.title = updateArticleDto.title ?? article.title;
    article.text = updateArticleDto.text ?? article.text;

    if (updateArticleDto.tags) {
      const foundedTags = await this.tagRepo.findBy({
        id: In(updateArticleDto.tags),
      });
      article.tags = foundedTags;
    }

    return await this.articleRepo.save(article);
  }

  async remove(id: number): Promise<string> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) {
      throw new NotFoundException('Article not found');
    }

    await this.articleRepo.softDelete(id);
    return 'Article deleted successfully';
  }
}