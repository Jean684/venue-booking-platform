import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
// import { Application } from "./Application";

@Entity()
export class Venue {
  @PrimaryGeneratedColumn("uuid")
  venueId: string;

  @Column({ type: "varchar", length: 254 })
  vendorId: string;

  @Column({ type: "varchar", nullable: true})
  heading: string;

  @Column({ type: "varchar", nullable: true })
  imgUrl: string;

  @Column({ type: "int", nullable: true })
  guests: number;

  @Column ({ type: "varchar", nullable: true })
  location: string;

  @Column({ type: "int", nullable: true })
  price: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", nullable: true })
  keywords: string;

  @Column({ nullable: false, default: false })
  featured: boolean;

  // @OneToMany(() => Application, (app) => app.venue, { lazy: true })
  // applications: Application[];

}
