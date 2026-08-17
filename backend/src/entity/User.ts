import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Application } from "./Application";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

//   Not recommended to use inheritance / extending the classes --> it becomes hell later to manage
//   Best to have a role column for user, then make another table for another type of users

  @Column({ type: "varchar" })
  role: string;

  @Column({ type: "varchar", length: 254, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "varchar", length: 40, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 12, nullable: true })
  phone: string;

  @CreateDateColumn ({ type: "date" })
  dateJoined: Date;

  @Column({ nullable: true })
  documents: string;

  // @Column({ type: "decimal", nullable: true })
  // ratingAverage: number;
  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  ratingAverage: number;

  // @Column({ type: "int", nullable: true })
  // ratingCount: number;
  @Column({ type: "int", default: 0 })
  ratingCount: number;

  @OneToMany(() => Application, (app) => app.user, { lazy: true })
  applications: Application[];
}
