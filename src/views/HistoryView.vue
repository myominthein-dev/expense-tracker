<template>
  <div class="container py-5 overflow-hidden">
    <div class="grid grid-cols-1">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            >Date
            <i class="text-sm text-gray-400"
              >From (Joined Date - default)</i
            ></label
          >

          <DatePicker
            v-model="fromDate"
            variant="filled"
            placeholder="Choose start date"
            class="mt-3 w-full"
          />
        </div>
        <div>
          <label
            >Date
            <i class="text-sm text-gray-400">To (Today - default)</i></label
          >

          <DatePicker
            v-model="toDate"
            variant="filled"
            placeholder="Choose end date"
            class="mt-3 w-full"
          />
        </div>

        <div class="flex items-end">
          <Button
            @click="filteredExpenses"
            text
            class="primary-btn mt-auto w-full"
            >Filter</Button
          >
        </div>
      </div>

      <div class="w-full">
        <div class="grid grid-cols-2 gap-4">
          <Button
            @click="toggleExpense"
            text
            :class="isExpense ? '!bg-white/10 ' : ''"
            class="primary-btn hover:!bg-white/10"
            >Your Expenses</Button
          >
          <Button
            text
            @click="toggleIncome"
            :class="isExpense ? '' : '!bg-white/10'"
            class="primary-btn hover:!bg-white/10"
          >
            Your Incomes
          </Button>
        </div>

        <DataTable :expenses="rangedExpenses" :isToday="true" />

        <div class="min-h-[100px] border border-gray-500 p-4 rounded-lg mt-5">
          <div class="flex gap-4">
            <h2 class="text-lg font-semibold text-gray-400">
              From - {{ formatDate(fromDate) }}
            </h2>
            <h2 class="text-lg font-semibold text-gray-400">
              To - {{ formatDate(toDate) }}
            </h2>
          </div>

          <div class="grid grid-cols-3 gap-4 mt-5">
            <div
              class="col-span-3 lg:col-span-1 flex justify-between lg:flex-col"
            >
              <h4 class="text-green-400 font-semibold">Total Income</h4>
              <p class="text-xl">
                {{ expenseStore.rangedCalculation.incomeAmount ?? "0" }}
              </p>
            </div>
            <div
              class="col-span-3 lg:col-span-1 flex justify-between lg:flex-col"
            >
              <h4 class="text-red-400 font-semibold">Total Expense</h4>
              <p class="text-xl">
                {{ expenseStore.rangedCalculation.expenseAmount ?? "0" }}
              </p>
            </div>
            <div
              class="col-span-3 lg:col-span-1 flex justify-between lg:flex-col"
            >
              <h4
                :class="
                  expenseStore.rangedCalculation.balance > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                "
                class="font-semibold"
              >
                Balance
              </h4>
              <p
                :class="
                  expenseStore.rangedCalculation.balance > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                "
                class="text-xl"
              >
                {{ expenseStore.rangedCalculation.balance }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTable from "@/components/DataTable.vue";
import {
  fetchExpenses,
  formatDate,
  isAuthenticated,
  setAuthInfo,
  today,
} from "@/lib/helper";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/stores/auth";
import { useExpenseStore } from "@/stores/expense";
import filter from "daisyui/components/filter";
import { Button, DatePicker } from "primevue";
import {
  computed,
  nextTick,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const expenseStore = useExpenseStore();

const isExpense = ref(true);
const rangedExpenses = ref(computed(() => expenseStore.getRangedExpenses));

onBeforeMount(async () => {
  await setAuthInfo();
  isAuthenticated("history");
});

const userInfo = computed(() => authStore.getAuthenticatedUserInfo);

const fromDate = ref(userInfo?.value?.joinedDate);
const toDate = ref(today);

const toggleExpense = () => {
  isExpense.value = true;
  expenseStore.setDynamicId(1);
};

const toggleIncome = () => {
  isExpense.value = false;
  expenseStore.setDynamicId(2);
};

const filteredExpenses = () => {
  
  if (fromDate.value && toDate.value) {
    rangedExpenses.value = expenseStore.setRangedExpenses(
      formatDate(fromDate.value),
      formatDate(toDate.value)
    );
    
  }
};

onMounted(async () => {
  await nextTick();
  await fetchExpenses();
  filteredExpenses();
});
</script>
