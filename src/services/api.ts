import axios from "axios";
import type {
  VacationRequest,
  CreateVacationRequestPayload,
  RejectRequestPayload,
  UpdateVacationRequestPayload,
  User,
} from "../types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Users
export const fetchUsers = (): Promise<User[]> =>
  api.get<User[]>("/users").then((r) => r.data);

// Vacation requests
export const fetchRequestsByUser = (userId: number): Promise<VacationRequest[]> =>
  api.get<VacationRequest[]>("/vacations", { params: { userId } }).then((r) => r.data);

export const fetchAllRequests = (status?: string): Promise<VacationRequest[]> =>
  api
    .get<VacationRequest[]>("/vacations", { params: status ? { status } : {} })
    .then((r) => r.data);

export const createRequest = (payload: CreateVacationRequestPayload): Promise<VacationRequest> =>
  api.post<VacationRequest>("/vacations", payload).then((r) => r.data);

export const approveRequest = (id: number, comments?: string): Promise<VacationRequest> =>
  api.patch<VacationRequest>(`/vacations/${id}/approve`, { comments }).then((r) => r.data);

export const rejectRequest = (id: number, payload: RejectRequestPayload): Promise<VacationRequest> =>
  api.patch<VacationRequest>(`/vacations/${id}/reject`, payload).then((r) => r.data);

export const updateRequest = (id: number, payload: UpdateVacationRequestPayload): Promise<VacationRequest> =>
  api.patch<VacationRequest>(`/vacations/${id}`, payload).then((r) => r.data);

export const deleteRequest = (id: number): Promise<void> =>
  api.delete(`/vacations/${id}`).then(() => undefined);
