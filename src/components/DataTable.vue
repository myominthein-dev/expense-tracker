<template>
    <div class="overflow-x-auto border h-[350px] overflow-y-scroll border-gray-500 rounded-lg mt-5">
        <table class="table">
            <!-- head -->
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody >

                <tr v-for="(e, i) in expenses?.filter(expense => expense.category_id == dynamicId)" :key="i">
                    <th>{{ i + 1 }}</th>
                    <td>{{ e.name }}</td>
                    <td>{{ e.amount }}</td>
                    <td>{{ e.category_id == 1 ? 'Expense' : 'Income' }}</td>
                    <td>{{ new Date(e.created_at).toISOString().split('T')[0] }}</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useExpenseStore } from '@/stores/expense';
const expenseStore = useExpenseStore();
const expenses = computed(() => expenseStore.getExpenses);
const dynamicId = computed(() => expenseStore.getDynamicId);
</script>