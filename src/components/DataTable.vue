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

                <tr  class="hidden last:table-row">
                    <td colspan="6" >
                        <EmptyData />
                    </td>
                </tr>
                <tr v-for="(e, i) in sortedExpenses?.filter(expense => expense.category_id == dynamicId)" :key="i">
                    <th>{{ i + 1 }}</th>
                    <td class="text-nowrap">{{ e.name }}</td>
                    <td class="text-nowrap">{{ e.amount }}</td>
                    <td>{{ e.category_id == 1 ? 'Expense' : 'Income' }}</td>
                    <td class="text-nowrap">{{ new Date(e.created_at).toISOString().split('T')[0] }}</td>
                    <td>
                        <button class="cursor-pointer" @click="handleSetting(e.id)">
                            <Setting />
                        </button>
                    </td>
                </tr>


            </tbody>
        </table>

        <!-- dialog -->

        
        <Dialog style="background-image: radial-gradient(circle at left top, var(--p-slate-800), var(--p-slate-950))"
            class=" border border-gray-600!" v-model:visible="visible" modal :style="{ width: '25rem' }">

            <div class="flex flex-col gap-3">
                <div>
                    <label class="text-gray-400">Date </label>

                    <DatePicker v-model="dataToUpdate.created_at" variant="filled"
                        class="border text-gray-600! mt-3 w-full" />
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
                    <Button text @click="handleDelete(dataToUpdate.id)"
                        class="!p-2 rounded-lg w-full flex items-center justify-center !text-red-400 !border !border-red-400  hover:border-red-500! hover:text-red-500! cursor-pointer">

                        <div v-if="isDeleteLoading" class="flex items-center  justify-center gap-2">
                            <ProgressSpinner class="size-5!" />
                            <ProgressSpinner class="size-5!" />

                        </div>

                        <span v-if="!isDeleteLoading">Delete</span>
                    </Button>

                    <Button text @click="handleUpdate(dataToUpdate.id)"
                        class="!p-2 rounded-lg w-full cursor-pointer flex items-center justify-center !text-primary-50 !border !border-white/30 hover:!bg-white/10">

                        <div v-if="isUpdateLoading" class="flex items-center  justify-center gap-2">
                            <ProgressSpinner class="size-5!" />
                            <ProgressSpinner class="size-5!" />

                        </div>

                        <span v-if="!isUpdateLoading">Update</span>

                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import { useExpenseStore } from '@/stores/expense';
import { useAuthStore } from '@/stores/auth';
import Setting from '@/assets/icons/setting.vue';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';
import { ProgressSpinner } from 'primevue';
import { InputText } from 'primevue';
import { supabase } from '@/lib/supabaseClient';
import Button from 'primevue/button';


import ConfirmPopup from 'primevue/confirmpopup';

import { useConfirm } from "primevue/useconfirm";
import EmptyData from './EmptyData.vue';

const confirm = useConfirm();

const acceptCallback = (event) => {
    // Handle the accept action
    console.log("Accepted:", event);
};
const rejectCallback = (event) => {
    // Handle the reject action
    console.log("Rejected:", event);
};
const isVisible = ref(false);

const openPopup = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        onShow: () => {
            isVisible.value = true;
        },
        onHide: () => {
            isVisible.value = false;
        }
    });
}
const expenseStore = useExpenseStore();
const authStore = useAuthStore();
const expenseData = ref([]);
const expenses = computed(() => expenseStore.getExpenses);
const dynamicId = computed(() => expenseStore.getDynamicId);
const visible = ref(false);
const isLoading = ref(false);
const isDeleteLoading = ref(false);
const isUpdateLoading = ref(false);


const dataToUpdate = ref({
    id: null,
    name: '',
    amount: '',
    created_at: new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Yangon',
    })
});

const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Yangon',
})


const sortedExpenses = computed(() => {
    return expenses.value?.filter(e => e.created_at == today).sort((a, b) => a.created_at.localeCompare(b.created_at));
})


const handleSetting = (id) => {
    visible.value = true;
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

    }
}

const handleUpdate = async (id) => {
    
    isUpdateLoading.value = true;
    try {
        const authUser = computed(() => authStore.getAuthenticatedUser);
        const updatedData = {
            name : dataToUpdate.value.name,
            amount: parseFloat(dataToUpdate.value.amount),
            user_id: authUser.value.id,
            category_id : dynamicId.value,
            created_at: new Date(dataToUpdate.value.created_at).toLocaleDateString('en-CA', {
                timeZone: 'Asia/Yangon',
            })
        };
        
        const { data , error } = await supabase.from('expenses').update({...updatedData}).eq('id', id).eq('user_id', authUser.value.id).select();

        if (!error) {
            expenseStore.updateExpense(id, updatedData)
        }
    } catch (err) {
        console.error('Error updating expense:', err);
    } finally {
        isUpdateLoading.value = false;
        visible.value = false;
    }
}

const handleDelete = async (id) => {
    openPopup(event);
    const authUser = computed(() => authStore.getAuthenticatedUser);

    try {
        isDeleteLoading.value = true;
        const { data, error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', authUser.value.id).select()


        if (!error) {
            expenseStore.deleteExpense(id)
        }

    } catch (err) {
        console.log(err)
    } finally {
        isDeleteLoading.value = false;
        visible.value = false
    }
}

</script>

<style scoped></style>