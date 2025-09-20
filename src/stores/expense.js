import { today } from "@/lib/helper";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useExpenseStore = defineStore("expense", () => {
  const expenses = ref(null);
  const rangedExpenses = ref([]);
  const dynamicId = ref(1);
  const getExpenses = computed(() => expenses.value);
  const getRangedExpenses = computed(() => rangedExpenses.value)
  const setRangedExpenses = (startDate, endDate) => {
    if (expenses.value) {
      const ranged =  expenses.value.filter(e => e.created_at >= startDate && e.created_at <= endDate);
      rangedExpenses.value = ranged;
      return ranged;
    }
  }

 
  const getDynamicId = computed(() => dynamicId.value);

  const todayCalculation = computed(() => {

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

  const rangedCalculation = computed (() => {
    
    const filteredExpenses = rangedExpenses.value?.filter(r => r.category_id == 1);
    const filteredIncomes  = rangedExpenses.value?.filter(r => r.category_id == 2)

    const expenseAmount = filteredExpenses?.reduce((acc , curr) => {
      acc += parseFloat(curr.amount)
      return acc
    }, 0)

    const incomeAmount = filteredIncomes?.reduce((acc, curr) =>  {
        acc += parseFloat(curr.amount)
        return acc
    }, 0)

    const balance = incomeAmount - expenseAmount 

    return {expenseAmount, incomeAmount, balance}
  })

  const setDynamicId = (id) => {
    dynamicId.value = id;
  };

  const setExpenses = (params) => {
    
    expenses.value = params;
  };

  const setExpense = (param) => {
    
    expenses.value = expenses.value ? [...expenses.value, param] : [param];
  };

  const resetExpense = () => {
    expenses.value = null;
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

  

  return { getExpenses, getDynamicId, getRangedExpenses, setRangedExpenses, setExpense, setExpenses, resetExpense, setDynamicId,  todayCalculation, rangedCalculation, deleteExpense, updateExpense };
});
