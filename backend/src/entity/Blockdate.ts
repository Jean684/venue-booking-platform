import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { Venue } from "./Venue";

@Entity()
export class Blockdate {
  @PrimaryGeneratedColumn("uuid")
  blockdateId: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @ManyToOne(() => Venue, (venue) => venue.blockdates, { lazy: true })
  venue: Venue;
}
