<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="ibox modal-box">
      <div class="ibox-title">
        <h5>Edit Vacation Request</h5>
        <button class="modal-close-btn" @click="emit('close')">✕</button>
      </div>
      <div class="ibox-content">
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="flex flex-wrap gap-3 mb-4">
            <!-- Start date -->
            <div>
              <label class="block text-xs font-semibold mb-1" style="color: var(--text-heading)">
                Start Date <span style="color: var(--color-danger)">*</span>
              </label>
              <input
                v-model="form.startDate"
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.startDate }"
              />
              <p v-if="errors.startDate" class="text-xs mt-1" style="color: var(--color-danger)">{{ errors.startDate }}</p>
            </div>
            <!-- End date -->
            <div>
              <label class="block text-xs font-semibold mb-1" style="color: var(--text-heading)">
                End Date <span style="color: var(--color-danger)">*</span>
              </label>
              <input
                v-model="form.endDate"
                type="date"
                :min="form.startDate"
                class="form-control"
                :class="{ 'is-invalid': errors.endDate }"
              />
              <p v-if="errors.endDate" class="text-xs mt-1" style="color: var(--color-danger)">{{ errors.endDate }}</p>
            </div>
          </div>
          <!-- Reason -->
          <div class="mb-5">
            <label class="block text-xs font-semibold mb-1" style="color: var(--text-heading)">
              Reason <span class="font-normal" style="color: var(--sidebar-text)">(optional)</span>
            </label>
            <textarea
              v-model="form.reason"
              rows="3"
              maxlength="500"
              class="form-control"
              style="resize: none"
            />
          </div>
          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button type="button" @click="emit('close')" class="btn-secondary">Cancel</button>
            <button type="submit" :disabled="store.loading" class="btn-primary">
              {{ store.loading ? "Saving..." : "Save changes" }}
            </button>
          </div>
          <p v-if="store.error" class="text-xs mt-3" style="color: var(--color-danger)">{{ store.error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useVacationStore } from "../../stores/vacationStore";
import type { VacationRequest } from "../../types";

const props = defineProps<{ request: VacationRequest }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const store = useVacationStore();

const form = reactive({
  startDate: props.request.startDate,
  endDate: props.request.endDate,
  reason: props.request.reason ?? "",
});

const errors = reactive({ startDate: "", endDate: "" });

const validate = (): boolean => {
  errors.startDate = "";
  errors.endDate = "";
  const today = new Date().toISOString().split("T")[0];
  let valid = true;
  if (!form.startDate) { errors.startDate = "Start date is required"; valid = false; }
  else if (form.startDate < today) { errors.startDate = "Start date cannot be in the past"; valid = false; }
  if (!form.endDate) { errors.endDate = "End date is required"; valid = false; }
  else if (form.endDate < form.startDate) { errors.endDate = "End date cannot be before start date"; valid = false; }
  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;
  try {
    await store.editRequest(props.request.id, {
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason || null,
    });
    emit("saved");
    emit("close");
  } catch {
    // error displayed via store.error
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  width: 100%;
  max-width: 500px;
  margin: 0 16px;
}

.ibox-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--sidebar-text);
  line-height: 1;
  padding: 0 4px;
}
.modal-close-btn:hover {
  color: var(--text-heading);
}

.btn-secondary {
  background: #f4f4f4;
  border: 1px solid #ddd;
  color: var(--text-primary);
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 3px;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #eaeaea;
}
</style>
