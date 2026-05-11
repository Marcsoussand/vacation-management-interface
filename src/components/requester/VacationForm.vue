<template>
  <div class="ibox">
    <div class="ibox-title">
      <h5>New Vacation Request</h5>
    </div>
    <div class="ibox-content">
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="flex flex-wrap items-start gap-3 mb-4">
          <!-- Start date -->
          <div>
            <label class="block text-xs font-semibold mb-1" style="color: var(--text-heading)">
              Start Date <span style="color: var(--color-danger)">*</span>
            </label>
            <input
              v-model="form.startDate"
              type="date"
              :min="today"
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
              :min="form.startDate || today"
              class="form-control"
              :class="{ 'is-invalid': errors.endDate }"
            />
            <p v-if="errors.endDate" class="text-xs mt-1" style="color: var(--color-danger)">{{ errors.endDate }}</p>
          </div>
          <!-- Balance indicator -->
          <div class="balance-badge" style="align-self: flex-end; margin-bottom: 2px; margin-left: 100px">
            <span class="balance-label">Remaining days</span>
            <span class="balance-value" :class="{ 'balance-warning': balanceAfter !== null && balanceAfter < 0 }">
              {{ store.currentUser?.vacationDaysBalance ?? '—' }}
              <span v-if="balanceAfter !== null" class="balance-after">
                ({{ balanceAfter }} after approval)
              </span>
            </span>
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
            placeholder="Briefly describe the reason for your leave..."
            class="form-control"
            style="resize: none"
          />
        </div>
        <!-- Submit -->
        <div class="flex items-center gap-3">
          <button type="submit" :disabled="store.loading" class="btn-primary">
            {{ store.loading ? "Submitting..." : "Submit Request" }}
          </button>
          <span v-if="successMsg" class="text-xs font-semibold" style="color: var(--color-success)">
            ✓ {{ successMsg }}
          </span>
          <span v-if="store.error" class="text-xs" style="color: var(--color-danger)">{{ store.error }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useVacationStore } from "../../stores/vacationStore";

const store = useVacationStore();
const today = new Date().toISOString().split("T")[0];
const form = reactive({ startDate: "", endDate: "", reason: "" });
const errors = reactive({ startDate: "", endDate: "" });
const successMsg = ref("");

// Compute how many days the current request spans (inclusive)
const requestedDays = computed(() => {
  if (!form.startDate || !form.endDate || form.endDate < form.startDate) return null;
  const start = new Date(form.startDate);
  const end = new Date(form.endDate);
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
});

// Balance remaining after this request would be approved
const balanceAfter = computed(() => {
  if (requestedDays.value === null || store.currentUser === null) return null;
  return store.currentUser.vacationDaysBalance - requestedDays.value;
});

const validate = (): boolean => {
  errors.startDate = "";
  errors.endDate = "";
  let valid = true;
  if (!form.startDate) { errors.startDate = "Start date is required"; valid = false; }
  else if (form.startDate < today) { errors.startDate = "Start date cannot be in the past"; valid = false; }
  if (!form.endDate) { errors.endDate = "End date is required"; valid = false; }
  else if (form.endDate < form.startDate) { errors.endDate = "End date cannot be before start date"; valid = false; }
  return valid;
};

const handleSubmit = async () => {
  successMsg.value = "";
  if (!validate() || !store.currentUser) return;
  try {
    await store.submitRequest({
      userId: store.currentUser.id,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason || undefined,
    });
    form.startDate = "";
    form.endDate = "";
    form.reason = "";
    successMsg.value = "Request submitted successfully!";
    setTimeout(() => (successMsg.value = ""), 3000);
  } catch {
    // error already set in store
  }
};
</script>

<style scoped>
.balance-badge {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.balance-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--sidebar-text);
}
.balance-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
}
.balance-after {
  font-weight: 400;
  color: var(--sidebar-text);
}
.balance-warning {
  color: var(--color-danger);
}
</style>
