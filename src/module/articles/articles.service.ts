import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(@InjectRepository(Article) private articelRepo: Repository<Article>) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articelRepo.create(createArticleDto)
    return await this.articelRepo.save(article)
  }

  async findAll(): Promise<Article[]> {
    return await this.articelRepo.find()
  }

  async findOne(id: number): Promise<Article> {
    const foundedArticle = await this.articelRepo.findOne({where: {id}})

    if(!foundedArticle) throw new NotFoundException("Articel not found")
    return foundedArticle
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<string> {
    const foundedArticle = await this.articelRepo.findOne({where: {id}})

    if(!foundedArticle) throw new NotFoundException("Article not found")

    await this.articelRepo.update(id, updateArticleDto)

    return "Updated article"
  }

  async remove(id: number): Promise<string> {
    const foundedArticle = await this.articelRepo.findOne({where: {id}})

    if(!foundedArticle) throw new NotFoundException("Article not found")
    
    await this.articelRepo.remove(foundedArticle)
    return "Deleted article"
  }
}
