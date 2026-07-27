import { BaseEntity } from "src/database/entites/base.entity";
import { Article } from "src/module/articles/entities/article.entity";
import { Auth } from "src/module/auth/entities/auth.entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name: "tag"})
export class Tag extends BaseEntity {
  @Column()
  title!: string 

//relations
    @ManyToOne(() => Auth, (user) => user.tags, {nullable: false, cascade: false})
    @JoinColumn({name: "author_id"})
    author!: Auth

  @ManyToOne(() => Article, (article) => article.tags)
  @JoinColumn({name: "tag_id"})
  articles?: Article
}
