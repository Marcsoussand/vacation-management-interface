import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

export type RequestStatus = "Pending" | "Approved" | "Rejected";

@Entity("vacation_requests")
export class VacationRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.vacationRequests)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "start_date", type: "date" })
  startDate!: string;

  @Column({ name: "end_date", type: "date" })
  endDate!: string;

  @Column({ type: "text", nullable: true })
  reason!: string | null;

  @Column({ type: "varchar", length: 20, default: "Pending" })
  status!: RequestStatus;

  @Column({ type: "text", nullable: true })
  comments!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
