import { defineStore } from "pinia";
import { ref } from "vue";
import type { User, VacationRequest, RequestStatus } from "../types";
import {
  fetchUsers,
  fetchRequestsByUser,
  fetchAllRequests,
  createRequest,
  approveRequest,
  rejectRequest,
  updateRequest,
  deleteRequest,
} from "../services/api";
import type { CreateVacationRequestPayload, UpdateVacationRequestPayload } from "../types";

export const useVacationStore = defineStore("vacation", () => {
  // State
  const currentUser = ref<User | null>(null);
  const users = ref<User[]>([]);
  const requests = ref<VacationRequest[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Load all available users (for user selection on home screen)
  const loadUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      users.value = await fetchUsers();
    } catch {
      error.value = "Failed to load users";
    } finally {
      loading.value = false;
    }
  };

  // Load requests for the current requester
  const loadMyRequests = async () => {
    if (!currentUser.value) return;
    loading.value = true;
    error.value = null;
    try {
      requests.value = await fetchRequestsByUser(currentUser.value.id);
    } catch {
      error.value = "Failed to load your requests";
    } finally {
      loading.value = false;
    }
  };

  // Load all requests for the validator, optionally filtered by status
  const loadAllRequests = async (status?: RequestStatus) => {
    loading.value = true;
    error.value = null;
    try {
      requests.value = await fetchAllRequests(status);
    } catch {
      error.value = "Failed to load requests";
    } finally {
      loading.value = false;
    }
  };

  // Submit a new vacation request
  const submitRequest = async (payload: CreateVacationRequestPayload) => {
    loading.value = true;
    error.value = null;
    try {
      const newRequest = await createRequest(payload);
      requests.value.unshift(newRequest);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit request";
      error.value = message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Approve a vacation request
  const approve = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const updated = await approveRequest(id);
      updateRequestInList(updated);
    } catch {
      error.value = "Failed to approve request";
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Reject a vacation request with a required comment
  const reject = async (id: number, comments: string) => {
    loading.value = true;
    error.value = null;
    try {
      const updated = await rejectRequest(id, { comments });
      updateRequestInList(updated);
    } catch {
      error.value = "Failed to reject request";
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Helper: replace an updated request in the local list
  const updateRequestInList = (updated: VacationRequest) => {
    const index = requests.value.findIndex((r) => r.id === updated.id);
    if (index !== -1) requests.value[index] = updated;
  };

  // Edit a pending vacation request
  const editRequest = async (id: number, payload: UpdateVacationRequestPayload) => {
    loading.value = true;
    error.value = null;
    try {
      const updated = await updateRequest(id, payload);
      updateRequestInList(updated);
    } catch {
      error.value = "Failed to update request";
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Delete a pending vacation request
  const deleteMyRequest = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await deleteRequest(id);
      requests.value = requests.value.filter((r) => r.id !== id);
    } catch {
      error.value = "Failed to delete request";
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const setCurrentUser = (user: User) => {
    currentUser.value = user;
  };

  return {
    currentUser,
    users,
    requests,
    loading,
    error,
    loadUsers,
    loadMyRequests,
    loadAllRequests,
    submitRequest,
    approve,
    reject,
    editRequest,
    deleteMyRequest,
    setCurrentUser,
  };
});
