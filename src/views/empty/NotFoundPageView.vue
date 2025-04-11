<template>
  <div>
    <p>Not Found Page View</p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
p {
  color: red;
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  text-decoration: underline;
  text-transform: uppercase;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    color: #fff;
    background-color: #007bff;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
}
</style>
