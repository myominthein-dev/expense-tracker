<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/default-layout.vue'
import { supabase } from './lib/supabaseClient';
import { onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useExpenseStore } from './stores/expense';

const router = useRouter();
const store = useAuthStore();
const expenseStore = useExpenseStore();

const getUserInfo = async (id) => {

  let { data: userInfo, error } = await supabase
    .from('users')
    .select('*')
    .eq('id',id).single()

  return userInfo;

}


onBeforeMount(async () => {

  
  const {data:{user}, error} = await supabase.auth.getUser();


  if (!error) {
    const userInfo = await getUserInfo(user.id);
   if (userInfo) {
    const userData = {
      name: userInfo.full_name,
      joinedDate: new Date(userInfo.created_at).toLocaleDateString(),
    }

    store.setAuthenticatedUserInfo(userData)

   
    const {data} = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id);
      
      expenseStore.setExpenses(data);
    }
    
  }


  if (store.getAuthenticatedUserInfo) {

    store.setAuthenticatedUser(user)
    router.push('/')

  } else {

    router.push('/guest')
  }

})

</script>

<template>
  <default-layout>
    <router-view /> 
  </default-layout>
</template>
