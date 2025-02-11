<template>
  <button :disabled="disabled" :class="['btn', theme]"><slot /></button>
</template>

<script setup>
const props =defineProps({
  theme: "green" | "grey-icon",
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped lang="scss">
.btn {
  width: auto;
  height: auto;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 6px;

  &.green {
    @apply bg-green;
    @apply text-white;
    padding: 6px 12px;
  }
  
  &.brilliant_azure {
    @apply bg-blue;
    @apply text-white;
    padding: 6px 12px;
  }

  &.grey-icon {
    border-radius: 3px;
    background: linear-gradient(180deg, #fefefe 0%, #f6f6f6 100%);
    @apply border;
    @apply border-grey-400;
    padding: 8px;
  }

  &:disabled {
    @apply bg-grey-400;
    @apply text-grey-900;
    cursor: not-allowed;
  }
}
</style>
