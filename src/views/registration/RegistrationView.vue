<template>
  <div class="registation-wrapper">
    <!-- Calls the Player Form component -->
    <Form />
  </div>
</template>

<script setup lang="ts">
import Form from '@/components/forms/PlayerForm.vue'
</script>

<style lang="css" scoped>
.registration-title {
  width: 45%;
  height: 80px;
}
</style>
