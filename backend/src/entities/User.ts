import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { VacationRequest } from "./VacationRequest";

export type UserRole = "Requester" | "Validator";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  role!: UserRole;

  @Column({ type: "int", default: 12 })
  vacationDaysBalance!: number;

  @OneToMany(() => VacationRequest, (request: VacationRequest) => request.user)
  vacationRequests!: VacationRequest[];
}
