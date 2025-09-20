<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/default-layout.vue'
import { onBeforeMount, onMounted } from 'vue';
import Toast from '@/volt/Toast.vue';
import { fetchExpenses } from './lib/helper';

onBeforeMount(async () => {
  await fetchExpenses();
})

</script>

<template>
  <default-layout>
    <Toast />
    <router-view /> 
  </default-layout>
</template>
