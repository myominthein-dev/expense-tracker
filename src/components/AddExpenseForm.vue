<template>
    <div class="flex flex-col gap-5">



        <div>
            <label>Date <i class="text-sm text-gray-400 ">(Today - default)</i></label>

            <DatePicker v-model="expenseData.created_at" variant="filled" class=" mt-3 w-full" />
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
            <Button text @click="cancel"
                class="!p-2 rounded-lg w-full flex items-center justify-center !text-primary-50 !border !border-white/30 hover:!bg-white/10">Cancel</Button>
            <Button text @click="addExpense"
                class="!p-2 rounded-lg w-full flex items-center justify-center !text-primary-50 !border !border-white/30 hover:!bg-white/10">

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

const expenseStore = useExpenseStore()
const isLoading = ref(false)


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
            const { data, error } = await supabase.from('expenses').insert({ ...expenseInfo, user_id: user.id }).select()


            if (data) {
                expenseStore.setExpense(data[0]);
            }

            isLoading.value = false;

        }
    } catch (err) {
        console.log(err);
        isLoading.value = false;
    } finally {
        expenseData.name = '';
        expenseData.amount = '';

    }
}

const cancel = () => {
    expenseData.name = '';
    expenseData.amount = '';

}




</script>