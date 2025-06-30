<template>
    <div class="col-span-2 md:col-span-1">
        <div class="flex flex-col  gap-4 border p-5 rounded-lg border-gray-500">
            <div class="grid grid-cols-2 gap-2">
                <Button @click="expenseTab" text :class="(isExpenseForm ? 'bg-white/10!' : '')"
                    class="!p-2 w-full rounded-lg flex items-center justify-center !text-primary-50  hover:!bg-white/10">Add
                    Expense</Button>
                <Button text @click="incomeTab" :class="(isIncomeForm ? 'bg-white/10!' : '')"
                    class="!p-2 rounded-lg w-full flex items-center justify-center text-primary-50!  hover:!bg-white/10">
                    Add Income
                </Button>
            </div>
           
            <div v-if="isExpenseForm">
                <AddExpenseForm/>
            </div>

            <div v-if="isIncomeForm">
                <AddIncomeForm/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AddExpenseForm from './AddExpenseForm.vue';
import AddIncomeForm from './AddIncomeForm.vue';
import Button from 'primevue/button';

const isExpenseForm = ref(true);
const isIncomeForm = ref(false);

const expenseTab = () => {
    isExpenseForm.value = true
    isIncomeForm.value = false;
};


const incomeTab = () => {
    isExpenseForm.value = false
    isIncomeForm.value = true;
};


</script>