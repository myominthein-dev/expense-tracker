<template>

    <header class=" dark:text-gray-200 border-b sticky z-50 top-0 bg-slate-900! border-gray-600">

        <div class="container py-3 grid grid-cols-2 md:grid-cols-3 ">

            <RouterLink class="flex items-center " to="/">
                <h1 class="text-lg! md:text-xl! text-gray-400 font-semibold font-mono">Track<span
                        class="text-red-600 ">er</span></h1>
            </RouterLink>


            <div class="  items-center hidden md:flex justify-center">
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
                <div class="flex! items-center! justify-center! gap-3 ">

                    <div v-if="!authenticatedUserInfo" class="flex  gap-3">
                        <Button :disabled="authStore.getStatusSignIn || authStore.getStatusSignUp"
                            class="btn bg-transparent! text-primary-400!" icon="pi pi-user"
                            @click="authStore.changeStatusSignUp">Sign Up</Button>

                        <Button :disabled="authStore.getStatusSignIn || authStore.getStatusSignUp"
                            class="bg-primary-400!  btn" icon="pi pi-user" @click="authStore.changeStatusSignIn">Sign In
                        </Button>

                    </div>

                    <p class="text-sm! lg:text-lg! text-gray-400 font-semibold font-mono flex! items-center! justify-center! "
                        v-if="authenticatedUserInfo">Hello! {{ authenticatedUserInfo.name }}</p>



                    <Button
                        class="btn border-red-400! hidden! md:block! hover:border-red-500! hover:text-red-500! text-red-400!"
                        text icon="pi pi-user" v-if="authenticatedUserInfo" @click='signOut'>Sign Out</Button>

                    <Button class="md:hidden! p-0!" text v-if="authenticatedUserInfo" @click='visible = true'>
                        <Menu />
                    </Button>

                </div>


            </div>

        </div>

        <!-- mobile nav -->

        <Drawer class="bg-slate-900! border-0! text-gray-300!" v-model:visible="visible" position="right">
            <template #header>
                <div class="flex items-center gap-2">

                    <span class="font-bold">{{ authenticatedUserInfo?.name }}</span>
                </div>
            </template>

            <ul class="flex flex-col gap-3 mt-5">

                <router-link to="/" class="text-gray-300 hover:text-gray-100">
                    <li class="primary-btn justify-start!">Home</li>
                </router-link>


                <router-link to="/history" class="text-gray-300 hover:text-gray-100">
                    <li class="primary-btn justify-start!">History</li>
                </router-link>

                <li class="primary-btn justify-start! border-red-400! text-red-400! hover:text-red-500!"
                    @click='signOut'>Sign Out
                </li>
            </ul>
        </Drawer>
    </header>

</template>

<script setup>

import Button from 'primevue/button';
import Menu from '../assets/icons/menu.vue';
import { useAuthStore } from '@/stores/auth';
import { useExpenseStore } from '@/stores/expense';
import { supabase } from '@/lib/supabaseClient'
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const authStore = useAuthStore();
const expenseStore = useExpenseStore();
const router = useRouter()
const authenticatedUserInfo = computed(() => authStore.getAuthenticatedUserInfo)

import Drawer from 'primevue/drawer';

const visible = ref(false)
import Swal from 'sweetalert2'

const signOut = async () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to sign out?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, sign out!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await supabase.auth.signOut()

                authStore.resetAuthenticatedUser()
                authStore.resetAuthenticatedUserInfo()
                expenseStore.resetExpense()
                router.push('/guest')
                visible.value = false; // Close the drawer after signing out
                if (!res.error) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have signed out successfully.',
                        life: 3000
                    });
                }

            } catch (err) {
                console.log(err);
            }     
        }
    })



}


</script>
