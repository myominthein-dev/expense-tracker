<template>
    <div class="flex flex-col gap-5">

        
        <div>
            <label>Date <i class="text-sm text-gray-400 ">(Today - default)</i></label>

            <DatePicker  v-model="expenseData.created_at" variant="filled" class=" mt-3 w-full" />
        </div>
        <div class="inline-flex flex-col gap-2 w-full">
            <label for="expense" class="text-primary-50 font-semibold">Expense</label>
            <InputText  id="expense" v-model="expenseData.name"
                class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-full"></InputText>

        </div>
        <div class="inline-flex flex-col gap-2 w-full">
            <label for="amount" class="text-primary-50 font-semibold">Amount</label>
            <InputText id="amount" v-model="expenseData.amount"
                class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-full"></InputText>

        </div>



        <div class="flex gap-3">
            <Button text @click="handleClear"
                class="primary-btn">Clear</Button>
            <Button text @click="addExpense"
                class="primary-btn">

                <div v-if="isLoading" class="flex items-center  justify-center gap-2">
                    <ProgressSpinner class="size-5!" />
                    <ProgressSpinner class="size-5!" />

                </div>

                <span v-if="!isLoading">Add Expense</span>

            </Button>
        </div>

    </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import { InputText } from 'primevue';

import DatePicker from 'primevue/datepicker';
import { supabase } from '@/lib/supabaseClient';

import { ProgressSpinner } from 'primevue';
import { useExpenseStore } from '@/stores/expense';
import Button from 'primevue/button';
const expenseStore = useExpenseStore()
const isLoading = ref(false)
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const expenseData = reactive({
    name: '',
    amount: '',
    created_at: new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Yangon',
    })
})

const expenseCategoryId = 1
const addExpense = async () => {
    try {
        isLoading.value = true;
        const { data: { user }, error } = await supabase.auth.getUser();
        const expenseInfo = {
            name: expenseData.name,
            amount: parseFloat(expenseData.amount),
            category_id: expenseCategoryId,
            created_at: new Date(expenseData.created_at).toLocaleDateString('en-CA', {
                timeZone: 'Asia/Yangon',
            })
        }                           


        if (!error) {

            if (!expenseInfo.name || !expenseInfo.amount) {
                isLoading.value = false;
                toast.add({ severity: 'error', summary: 'Error', detail: 'Fill the form carefully!', life: 3000 });

                return;
            }

            const { data, error } = await supabase.from('expenses').insert({ ...expenseInfo, user_id: user.id }).select()


            if (!error) {
                expenseStore.setExpense(data[0]);
                toast.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully!', life: 3000 });
            }

            isLoading.value = false;

        }
    } catch (err) {
        isLoading.value = false;
    } finally {
        expenseData.name = '';
        expenseData.amount = '';

    }
}

const handleClear = () => {
    expenseData.name = '';
    expenseData.amount = '';
    expenseData.created_at = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Yangon',
    })
}

</script>