<template>

    <header class="dark:bg-slate-900 dark:text-gray-200 border-b border-gray-600">

        <div class="container py-3 grid grid-cols-3 ">

            <RouterLink class="flex items-center " to="/">
                <h1 class="text-xl text-gray-400 font-semibold font-mono">Track<span class="text-red-600 ">er</span></h1>
            </RouterLink>


            <div class=" flex items-center justify-center">
                <nav v-if="authenticatedUserInfo" class=" flex items-center justify-center">
                <ul class="flex gap-4">
                    <li>
                        <router-link to="/" class="text-gray-500 hover:text-gray-700">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/history" class="text-gray-500 hover:text-gray-700">History</router-link>
                    </li>
                </ul>
            </nav>
            </div>

            <div class="flex items-center justify-end  ">
                <div class="flex gap-3 ">

                    <div v-if="!authenticatedUserInfo" class="flex  gap-3">
                        <Button :disabled="store.getStatusSignIn || store.getStatusSignUp"
                            class="btn bg-transparent! text-primary-400!"  icon="pi pi-user"
                            @click="store.changeStatusSignUp" >Sign Up</Button>

                        <Button :disabled="store.getStatusSignIn || store.getStatusSignUp" class="bg-primary-400!  btn"
                            icon="pi pi-user" @click="store.changeStatusSignIn">Sign In </Button>

                    </div>

                    <p  class="text-lg text-gray-400 font-semibold font-mono flex items-center justify-center " v-if="authenticatedUserInfo">Hello! {{ authenticatedUserInfo.name }}</p>
                  

                        
                      <Button class="btn border-red-400! hover:border-red-500! hover:text-red-500! text-red-400!"  text   icon="pi pi-user" v-if="authenticatedUserInfo" @click='signOut'>Sign Out</Button>
                   
                </div>


            </div>

        </div>

    </header>

</template>

<script setup>

import Button from 'primevue/button';

import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabaseClient'
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const store = useAuthStore();
const router = useRouter()
const authenticatedUserInfo =  computed(() => store.getAuthenticatedUserInfo)



const  signOut = async () =>  {

    try {
        const {error} = await supabase.auth.signOut()

        if (!error) {
            store.resetAuthenticatedUser()
            store.resetAuthenticatedUserInfo()
            router.push('/guest')
        }
        
    } catch (err) {

    }


}


</script>
