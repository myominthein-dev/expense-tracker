<template>
    <div>


        <Dialog v-model:visible="visible" pt:root:class="!border-0 !bg-transparent" pt:mask:class="backdrop-blur-sm">
            <template #container>
             
                    <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl"
                        style="background-image: radial-gradient(circle at left top, var(--p-slate-800), var(--p-slate-950))">

                        <h3 class="text-center text-lg font-semibold">Tracker - Sign Up</h3>


                        <div class="inline-flex flex-col gap-2">
                            <label for="username" class="text-primary-50 font-semibold">Username</label>
                            <InputText id="username" v-model="userInfo.full_name"
                                class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-80"></InputText>
                               
                        </div>
                        <div class="inline-flex flex-col gap-2">
                            <label for="userEmail" class="text-primary-50 font-semibold">Email</label>
                            <InputText id="userEmail" v-model="userInfo.email"
                                class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-80"></InputText>
                        </div>
                        <div class="inline-flex flex-col gap-2">
                            <label for="password" class="text-primary-50 font-semibold">Password</label>
                            <InputText id="password" v-model="userInfo.password"
                                class="!bg-white/20 outline-sky-900! !border-0 !p-2 !text-primary-50 w-80"
                                type="password">
                            </InputText>
                        </div>

                        <div class="flex items-center gap-4">
                            <Button label="Cancel" @click="store.changeStatusSignUp" text
                                class="!p-2 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"></Button>
                            <Button text @click="signUp"
                                class="!p-2 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10">

                                <div v-if="isLoading" class="flex gap-2">
                                    <ProgressSpinner class="size-5!" />
                                    <ProgressSpinner class="size-5!" />

                                </div>

                                <span v-if="!isLoading">Sign Up</span>

                            </Button>
                        </div>




                    </div>
              
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';


import Button from 'primevue/button';
import { Dialog } from 'primevue';
import { InputText } from 'primevue';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';
import {ProgressSpinner} from 'primevue';

const store = useAuthStore()
const router = useRouter()
const isLoading = ref(false)

const visible = computed(() => store.getStatusSignUp)

const userInfo = reactive({
    'full_name': '',
    'email': '',
    'password': ''
})

const signUp = async () => {
    
    isLoading.value = true
   
    try {

        const { data: { user }, error } = await supabase.auth.signUp({ 'email': userInfo.email, 'password': userInfo.password })

        if (user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: user.id, // must match auth.users.id
                        full_name: userInfo.full_name,
                    },
                ]);
        }

        if (!error) {

            userInfo.email = ''
            userInfo.password = ''
            userInfo.full_name = ''
            store.changeStatusSignUp()

            router.push('/')
        }
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false

    }
}


</script>