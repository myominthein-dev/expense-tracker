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
                    <th></th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="(e, i) in sortedExpenses?.filter(expense => expense.category_id == dynamicId)" :key="i">
                    <th>{{ i + 1 }}</th>
                    <td>{{ e.name }}</td>
                    <td>{{ e.amount }}</td>
                    <td>{{ e.category_id == 1 ? 'Expense' : 'Income' }}</td>
                    <td>{{ new Date(e.created_at).toISOString().split('T')[0] }}</td>
                    <td>
                        <button class="cursor-pointer" @click="handleSetting(e.id)">
                            <Setting />
                        </button>
                    </td>
                </tr>

            </tbody>
        </table>

        <!-- dialog -->


        <Dialog style="background-image: radial-gradient(circle at left top, var(--p-slate-800), var(--p-slate-950))" class=" border border-gray-600!" v-model:visible="visible" modal :style="{ width: '25rem' }">
           
           <div class="flex flex-col gap-3">
                 <div>
                <label class="text-gray-400">Date </label>

                <DatePicker v-model="dataToUpdate.created_at"  variant="filled" class="border text-gray-600! mt-3 w-full" />
            </div>
            <div class="inline-flex flex-col gap-2 w-full">
                <label for="name" class=" font-semibold text-gray-500!">Name</label>
                <InputText id="name" v-model="dataToUpdate.name"
                    class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-full"></InputText>
            </div>
            <div class="inline-flex flex-col gap-2 w-full">
                <label for="amount" class=" font-semibold text-gray-500!">Amount</label>
                <InputText id="amount" v-model="dataToUpdate.amount"
                    class="bg-white/20! outline-sky-900!  !border-0 !p-2 !text-primary-50 w-full"></InputText>

            </div>

             <div class="flex gap-3 mt-3">
            <Button text @click="handleDelete"
                class="!p-2 rounded-lg w-full flex items-center justify-center !text-red-400 !border !border-red-400  hover:border-red-500! hover:text-red-500! cursor-pointer">Delete</Button>
            <Button text @click="handleUpdate"
                class="!p-2 rounded-lg w-full cursor-pointer flex items-center justify-center !text-primary-50 !border !border-white/30 hover:!bg-white/10">

                <div v-if="isLoading" class="flex items-center  justify-center gap-2">
                    <ProgressSpinner class="size-5!" />
                    <ProgressSpinner class="size-5!" />

                </div>

                <span v-if="!isLoading">Update</span>

            </Button>
        </div>
           </div>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import { useExpenseStore } from '@/stores/expense';
import Setting from '@/assets/icons/setting.vue';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';
import { ProgressSpinner } from 'primevue';
import { InputText } from 'primevue';

const expenseStore = useExpenseStore();
const expenseData = ref([]);
const expenses = computed(() => expenseStore.getExpenses);
const dynamicId = computed(() => expenseStore.getDynamicId);
const visible = ref(false);
const isLoading = ref(false);
const settingHandle = (id) => {
    visible.value = true;
    console.log(id);
}

const dataToUpdate = ref({
    id: null,
    name: '',
    amount: '',
    created_at: new Date().toLocaleDateString('en-CA',{
    timeZone : 'Asia/Yangon',
})
});

const today = new Date().toLocaleDateString('en-CA',{
    timeZone : 'Asia/Yangon',
})

console.log('a',today);
const sortedExpenses = computed(() => {
    return expenses.value?.filter(e => e.created_at == today).sort((a, b) => a.created_at.localeCompare(b.created_at));
})


const handleSetting = (id) => {
    const expense = expenses.value.find(e => e.id === id);
    if (expense) {
        dataToUpdate.value = {
            id: expense.id,
            name: expense.name,
            amount: expense.amount,
            created_at: new Date(expense.created_at).toLocaleDateString('en-CA', {
                timeZone: 'Asia/Yangon',
            })
        };
        settingHandle(id);
    }
}

const handleUpdate = async () => {
    console.log('update');
}

const handleDelete = async () => {
    console.log('delete');
}   

</script>

<style scoped>

</style>