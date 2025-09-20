<template>
  <div class=" flex-grow flex items-center gap-4 justify-center flex-col">
    <h2 class="text-2xl md:text-5xl font-serif font-bold text-gray-500 mb-4">Track Your Expenses</h2>
    <p class="text-gray-600 text-sm text-center md:text-lg italic">"Your money, your rules — keep track effortlessly."</p>
    <div>
    <p class="text-gray-700 text-sm md:text-lg italic"> <span @click="store.changeStatusSignUp" class="underline cursor-pointer font-semibold text-gray-500 px-2">Create an account</span> & Track all the way!</p> 
    </div>
  </div>
</template>

<script setup>
import { isAuthenticated, setAuthInfo } from '@/lib/helper';
import { useAuthStore } from '@/stores/auth';
import { onBeforeMount } from 'vue';


const store = useAuthStore();


onBeforeMount(async () => {
  await setAuthInfo();
  isAuthenticated('/');
})

</script>