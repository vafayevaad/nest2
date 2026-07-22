import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm"

export class BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @CreateDateColumn()
    createdAt!: Date
    
  @CreateDateColumn()
    updatedAt!: Date
    
}