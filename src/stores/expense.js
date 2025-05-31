import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useExpenseStore = defineStore("expense", () => {
  const expenses = ref(null);

  const dynamicId = ref(1);

  const getExpenses = computed(() => expenses.value);

  const getDynamicId = computed(() => dynamicId.value);

  const todayCalculation = computed(() => {

    const today = new Date().toLocaleDateString("en-CA",{timeZone : "Asia/Yangon"});

    const todayExpenses = expenses.value?.filter(
      (e) => e.created_at === today && e.category_id === 1
    );
    
    const todayIncomes = expenses.value?.filter(
      (e) => e.created_at === today && e.category_id === 2
    );

    const todayIncome = todayIncomes?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),
      0.0
    );
    const todayExpense = todayExpenses?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),
      0.0
    );
    const todayBalance = todayIncome - todayExpense;

    return {todayIncome, todayExpense, todayBalance}
  });

  const setDynamicId = (id) => {
    dynamicId.value = id;
  };

  const setExpenses = (params) => {
    console.log("store", params);
    expenses.value = params;
  };

  const setExpense = (param) => {
    console.log("store 2", param);
    expenses.value = expenses.value ? [...expenses.value, param] : [param];
  };

  return { setExpense, setExpenses, getExpenses, getDynamicId, setDynamicId, todayCalculation };
});
