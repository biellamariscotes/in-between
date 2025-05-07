<template>
  <div class="registation-wrapper">
    <!-- Calls the Player Form component -->

    <img src="../../assets/img/landing-assets/registration-title.png" class="registration-title" />
    <Form />
  </div>
</template>

<script setup lang="ts">
import Form from '@/components/forms/PlayerForm.vue'
</script>

<style>
.registration-title {
  width: 35%;
  padding: 0.4em 0em;
}

@media (max-width: 768px) {
  .registration-title {
    width: 70%;
    padding: 0.3em 0;
  }
}

@media (max-width: 480px) {
  .registration-title {
    width: 90%;
  }
}
</style>
