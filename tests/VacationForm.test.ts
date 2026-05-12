import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import VacationForm from "../src/components/requester/VacationForm.vue";
import { useVacationStore } from "../src/stores/vacationStore";

// Mock the store's submitRequest action
vi.mock("../src/services/api", () => ({
  createRequest: vi.fn(),
  fetchRequestsByUser: vi.fn().mockResolvedValue([]),
  fetchAllRequests: vi.fn().mockResolvedValue([]),
  fetchUsers: vi.fn().mockResolvedValue([]),
  approveRequest: vi.fn(),
  rejectRequest: vi.fn(),
}));

describe("VacationForm", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const store = useVacationStore();
    store.currentUser = { id: 1, name: "Alice Martin", role: "Requester", vacationDaysBalance: 12 };
  });

  it("renders the form correctly", () => {
    const wrapper = mount(VacationForm, {
      global: { plugins: [createPinia()] },
    });
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("shows validation errors when submitting empty form", async () => {
    const wrapper = mount(VacationForm, {
      global: { plugins: [createPinia()] },
    });
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("Start date is required");
    expect(wrapper.text()).toContain("End date is required");
  });

  it("shows error when end date is before start date", async () => {
    const wrapper = mount(VacationForm, {
      global: { plugins: [createPinia()] },
    });
    const inputs = wrapper.findAll('input[type="date"]');
    await inputs[0].setValue("2026-08-10");
    await inputs[1].setValue("2026-08-01");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("End date cannot be before start date");
  });
});
