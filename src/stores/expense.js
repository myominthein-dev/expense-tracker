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
    
    expenses.value = params;
  };

  const setExpense = (param) => {
    console.log("store 2", param);
    expenses.value = expenses.value ? [...expenses.value, param] : [param];
  };

  const deleteExpense = (id) => {
    
    if (expenses.value) {
      expenses.value = expenses.value.filter((expense) => expense.id !== id);
    }
  }

  const updateExpense = (id, updatedExpense) => {
    if (expenses.value) {
      console.log(updatedExpense);
    
      expenses.value = expenses.value.map((expense) => {
       return  expense.id == id ? {...expense, ...updatedExpense} : expense;
      })
    }
  }

  return { setExpense, setExpenses, getExpenses, getDynamicId, setDynamicId, todayCalculation, deleteExpense, updateExpense };
});
