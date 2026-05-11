<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4" style="background: rgba(0,0,0,0.5)">
    <div class="ibox w-full max-w-md" style="margin: 0">
      <div class="ibox-title">
        <h5>Reject Vacation Request</h5>
      </div>
      <div class="ibox-content">
        <p class="text-sm mb-3" style="color: var(--text-primary)">
          A comment is required when rejecting a request.
        </p>
        <textarea
          v-model="comment"
          rows="4"
          maxlength="500"
          placeholder="Enter your rejection reason..."
          class="form-control mb-1"
          :class="{ 'is-invalid': showError }"
          style="resize: none"
          autofocus
        />
        <p v-if="showError" class="text-xs mb-3" style="color: var(--color-danger)">A comment is required.</p>
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="emit('cancel')"
            class="text-sm px-4 py-1.5 border rounded"
            style="background: #fff; color: var(--text-primary); border-color: var(--panel-border); cursor: pointer"
          >
            Cancel
          </button>
          <button @click="handleConfirm" class="btn-danger" style="padding: 6px 14px; font-size: 13px">
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "confirm", comment: string): void;
  (e: "cancel"): void;
}>();

const comment = ref("");
const showError = ref(false);

const handleConfirm = () => {
  if (!comment.value.trim()) {
    showError.value = true;
    return;
  }
  emit("confirm", comment.value.trim());
};
</script>
