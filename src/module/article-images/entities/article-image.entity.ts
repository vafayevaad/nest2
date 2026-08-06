import { Article } from "src/module/articles/entities/article.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "article_image"})
export class ArticleImage  extends BaseEntity{
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  sortOrder!: number

  @Column()
  url!: string

  @ManyToOne(() => Article, (article) => article.articleImages, {cascade: true})
  @JoinColumn({name: "article_id"})
  article!: Article
}
