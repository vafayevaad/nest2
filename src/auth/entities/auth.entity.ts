import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({timestamps:true, tableName: "auth"})
export class Auth extends Model {
  @Column({allowNull: false})
  username!: string;
  
  @Column({allowNull: false})
  email!: string;

  @Column({allowNull: false})
  password!: string;

  @Column({allowNull: true})
  code?: string;

  @Column({allowNull: true, type: DataType.BIGINT})
  otpTime?: bigint;
}
