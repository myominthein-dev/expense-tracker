<template>
    <div class="container py-5  overflow-hidden">
        <div v-if="userData">
            <h2 class="text-xl text-center text-gray-400 font-semibold">You've joined on {{ joinedData }}</h2>

            <div class="grid grid-cols-3 gap-5 mt-5 w-full">

                <ToggleForms />

                <div class="col-span-2 ">

                    <div class="grid grid-cols-2 gap-4">
                        <Button @click="toggleExpense" text :class="(isExpense ? '!bg-white/10 ' : '')"
                            class="!p-2 w-full flex items-center justify-center !text-primary-50 !border cursor-pointer rounded-lg !border-white/30 hover:!bg-white/10">Your
                            Expenses</Button>
                        <Button text @click="toggleIncome" :class="(isExpense ? '' : '!bg-white/10')"
                            class="!p-2 w-full flex items-center justify-center !text-primary-50 !border  cursor-pointer rounded-lg !border-white/30 hover:!bg-white/10">
                            Your Incomes
                        </Button>
                    </div>

                    <DataTable />

                    <div class="min-h-[100px] border border-gray-500  p-4 rounded-lg mt-5">

                        <h2 class="text-lg font-semibold text-gray-400"> Date - {{ new
                            Date().toLocaleDateString('en-CA',{timeZone : "Asia/Yangon"}) }}</h2>
                        <div class="grid grid-cols-3 gap-4 mt-5">
                            <div>
                                <h4 class="text-green-400  font-semibold">Total Income</h4>
                                <p class="text-xl">{{ expenseStore.todayCalculation.todayIncome }}</p>
                            </div>
                            <div>
                                <h4 class="text-red-400  font-semibold">Total Expense</h4>
                                <p class="text-xl">{{ expenseStore.todayCalculation.todayExpense }}</p>
                            </div>
                            <div>
                                <h4 class="font-semibold">Balance</h4>
                                <p class="text-xl">{{ expenseStore.todayCalculation.todayBalance }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script setup>
import { supabase } from '@/lib/supabaseClient';
import { computed, onMounted, ref, reactive, onBeforeMount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { InputText } from 'primevue';
import { ProgressSpinner } from 'primevue';
import ToggleForms from '@/components/ToggleForms.vue'
import { useExpenseStore } from '@/stores/expense';
import DataTable from '@/components/DataTable.vue';

const isLoading = ref(false)

const store = useAuthStore();

const expenseStore = useExpenseStore()
const expenses = ref()
onBeforeMount(() => {
 expenses.value = computed(() => expenseStore.getExpenses)

})

const joinedData = ref('')


const isExpense = ref(true)
const todayExpense = ref(0.00);
const todayIncome = ref(0.00);
const todayBalance = ref(0.00);





const toggleExpense = () => {
    isExpense.value = true
    expenseStore.setDynamicId(1)
}

const toggleIncome = () => {
    isExpense.value = false
    expenseStore.setDynamicId(2)
}

const userData = computed(() => store.getAuthenticatedUserInfo)

const getUserInfo = async (id) => {
    const { data: info, error } = await supabase.from('users').select('*').eq('id', id).single();

    return info;
}

onMounted(async () => {

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!error) {

        const info = await getUserInfo(user.id)
        if (info) {
            const profile = {
                name: info.full_name,
                joinedData: new Date(info.created_at).toLocaleDateString()
            }
            joinedData.value = profile.joinedData
            store.setAuthenticatedUserInfo(profile)
        }

    }

})

const addExpense = async () => {

    isLoading.value = true



    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        const { error: insertError } = await supabase
            .from('expenses')
            .insert([
                {
                    user_id: user.id,
                    name: expenseData.name, // must match auth.users.id
                    amount: expenseData.amount,
                    category_id: 1,
                },
            ]);


        if (!insertError) {

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
