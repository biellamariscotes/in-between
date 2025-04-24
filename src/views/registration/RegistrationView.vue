<template>
  <div class="registation-wrapper">
    <!-- registration-title.png -->
    <img
      src="../../assets/img/landing-assets/registration-title.png"
      alt="registration-title"
      class="registration-title"
    />
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
