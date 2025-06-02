<template>
    <div class="flex flex-col gap-5">

        <div>
            <label>Date <i class="text-sm text-gray-400 ">(Today - default)</i></label>
            <DatePicker v-model="incomeData.created_at" class="mt-3 w-full" />
        </div>
        <div class="inline-flex flex-col gap-2 w-full">
            <label for="incomeData" class="text-primary-50 font-semibold">Income</label>
            <InputText id="incomeData" v-model="incomeData.name"
                class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-full"></InputText>

        </div>
        <div class="inline-flex flex-col gap-2 w-full">
            <label for="amount" class="text-primary-50 font-semibold">Amount</label>
            <InputText id="amount" v-model="incomeData.amount"
                class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-full"></InputText>

        </div>


        <div class="flex gap-3 ">
            <Button text @click="cancel"
                class="primary-btn">Cancel</Button>
            <Button text @click="addIncome"
                class="primary-btn">

                <div v-if="isLoading" class="flex items-center  justify-center gap-2">
                    <ProgressSpinner class="size-5!" />
                    <ProgressSpinner class="size-5!" />

                </div>

                <span v-if="!isLoading">Add Income</span>

            </Button>
        </div>

    </div>
</template>

<script setup>

import { reactive, ref, computed } from 'vue';

import { InputText } from 'primevue';

import { DatePicker } from 'primevue';
import { supabase } from '@/lib/supabaseClient';
import { ProgressSpinner } from 'primevue';
import { useExpenseStore } from '@/stores/expense';
import Button from 'primevue/button';

const expenseStore = useExpenseStore();


const incomeData = reactive({
    name: '',
    amount: '',
    created_at: new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Yangon',
    })
})

const isLoading = ref(false);

const incomeCategoryId = 2

const addIncome = async () => {
    isLoading.value = true;
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        const incomeToSave = {
            name: incomeData.name,
            amount: incomeData.amount,
            created_at: new Date(incomeData.created_at).toLocaleDateString('en-CA', {
                timeZone: 'Asia/Yangon',
            }),
            user_id: user.id,
            category_id: incomeCategoryId
        };
        if (!error) {
            console.log(incomeToSave);

            const { data, error } = await supabase.from('expenses').insert(incomeToSave).select();

            if (data) {
                expenseStore.setExpense(data[0]);
                isLoading.value = false;
            }

            incomeData.name = '';
            incomeData.amount = '';

        }

    } catch (err) {
        isLoading.value = false;
    }
}

const cancel = () => {
    incomeData.name = '';
    incomeData.amount = '';
}




</script>