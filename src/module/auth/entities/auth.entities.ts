import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/common/enums/user-role";
import { BaseEntity } from "src/database/entites/base.entity";
import { Column, Entity } from "typeorm";


@Entity({name: "auth"})
export class Auth extends BaseEntity {
  @ApiProperty({default: "diana"})
  @Column({nullable: false})
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER})
  role!: UserRole

  @Column()
  code?: string;

  @Column({nullable: true, type: "bigint"})
  otpTime?: number;
}