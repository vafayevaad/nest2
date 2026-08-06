import { BaseEntity } from "src/database/entites/base.entity";
import { ArticleImage } from "src/module/article-images/entities/article-image.entity";
import { Auth } from "src/module/auth/entities/auth.entities";
import { Tag } from "src/module/tag/entities/tag.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "article"})
export class Article extends BaseEntity {
  @Column()
  title!: string
  
  @Column()
  text!: string

  @Column({nullable: false})
  backgroundImage!: string

  @DeleteDateColumn({nullable: true})
  deletedAt?: Date

  //relations
  @ManyToOne(() => Auth, (user) => user.articles)
  @JoinColumn({name: "auth_id"})
  author!: Auth

  @OneToMany(() => Tag, (tag) => tag.articles)
  @JoinColumn({name: "tag_id"})
  tags!: Tag[]

  @OneToMany(() => ArticleImage, (articleImage) => articleImage.article, {nullable: true})
  articleImages: ArticleImage[]
}
