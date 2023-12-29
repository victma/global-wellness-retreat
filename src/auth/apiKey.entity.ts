import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ApiKey {
  @PrimaryColumn()
  hash: string;

  @Column()
  partnerId: string;
}
