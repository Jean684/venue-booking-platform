import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";

@Entity()
export class Application {
  @PrimaryGeneratedColumn("uuid")
  applicationId: string;

  @Column({ type: "varchar", length: 255 })
  eventName: string;

  @Column({ type: "int" })
  guestCount: number;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column({ type: "varchar" })
  status: string;

  @Column({ type: "text", nullable: true })
  comment: string;

  @Column({ type:"decimal", precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column({type: "bit", default: false})
  rated: boolean;

  // @ManyToOne(() => Venue, (venue) => venue.applications, { lazy: true })
  // venue: Venue;

  // @ManyToOne(() => User, (user) => user.applications, { lazy: true})
  // user: User;
}
