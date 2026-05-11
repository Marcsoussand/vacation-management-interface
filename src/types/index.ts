export type UserRole = "Requester" | "Validator";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface User {
  id: number;
  name: string;
  role: UserRole;
  vacationDaysBalance: number;
}

export interface VacationRequest {
  id: number;
  userId: number;
  user?: User;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: RequestStatus;
  comments: string | null;
  createdAt: string;
}

export interface CreateVacationRequestPayload {
  userId: number;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface RejectRequestPayload {
  comments: string;
}

export interface UpdateVacationRequestPayload {
  startDate: string;
  endDate: string;
  reason?: string | null;
}
