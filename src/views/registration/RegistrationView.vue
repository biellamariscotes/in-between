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
</style>
