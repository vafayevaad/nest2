import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/module/articles/entities/article.entity';
import { ArticleImage } from './entities/article-image.entity';
import { ArticleImagesController } from './article-images.controller';
import { ArticleImagesService } from './article-images.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleImage, Article])],
  controllers: [ArticleImagesController],
  providers: [ArticleImagesService],
})
export class ArticleImagesModule {}