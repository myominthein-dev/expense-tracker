<template>
    <div>


        <Dialog v-model:visible="visible" pt:root:class="!border-0 !bg-transparent"
            pt:mask:class="backdrop-blur-sm !pointer-event-none">
            <template #container>
                <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl"
                    style="background-image: radial-gradient(circle at left top, var(--p-slate-800), var(--p-slate-950))">

                    <h3 class="text-center text-lg font-semibold">Tracker - Sign In</h3>

                    <div class="inline-flex flex-col gap-2">
                        <label for="userEmail" class="text-primary-50 font-semibold">User Email</label>
                        <InputText id="userEmail" v-model="userInfo.email"
                            class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-80"></InputText>
                    </div>
                    <div class="inline-flex flex-col gap-2">
                        <label for="password" class="text-primary-50 font-semibold">Password</label>
                        <InputText id="password" v-model="userInfo.password"
                            class="!bg-white/20 outline-sky-900! !border-0 !p-2 !text-primary-50 w-80" type="password">
                        </InputText>
                    </div>
                    <div class="flex items-center gap-4">
                        <Button label="Cancel" @click="store.changeStatusSignIn" text
                            class="!p-2 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"></Button>
                        <Button text @click="signIn"
                                class="!p-2 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10">

                                <div v-if="isLoading" class="flex gap-2">
                                    <ProgressSpinner class="size-5!" />
                                    <ProgressSpinner class="size-5!" />

                                </div>

                                <span v-if="!isLoading">Sign In</span>

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
import {ProgressSpinner} from 'primevue';
import { useRouter } from 'vue-router';

const isLoading = ref(false)

const store = useAuthStore()

const router = useRouter();

const userInfo = reactive({
    'email': '',
    'password': ''
})

const visible = computed(() => store.getStatusSignIn)

const signIn = async () => {

    try {
        isLoading.value = true
        const { data, error } = await supabase.auth.signInWithPassword({
            'email' : userInfo.email,
            'password' : userInfo.password

        })

        if(!error) {
            router.push('/')
            store.changeStatusSignIn()
            userInfo.email = ''
            userInfo.password = ''  
        }

        
    } catch (err) {
        console.log(err)
    } finally {
        isLoading.value = false
    }

}


const addName = async () => {
    const { data, error } = await supabase
        .from('users')
        .insert([
            { 'full_name': "Myo Min " },
        ])
        .select()

    console.log(data)
}



</script>