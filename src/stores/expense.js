import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useExpenseStore = defineStore('expense' , () => {
    
    const expenses = ref(null)

    const dynamicId = ref(1)

    const getExpenses = computed(() => expenses.value)

    const getDynamicId = computed(() => dynamicId.value)    

    const setDynamicId = (id) => {
        dynamicId.value = id
    }

    const setExpenses = (params) => {
        console.log('store' , params);
        expenses.value = params
    }

    const setExpense = (param) => {
        console.log('store 2', param)
       expenses.value = expenses.value ? [...expenses.value, param] : [param]
    }

    
    return { setExpense,setExpenses, getExpenses ,getDynamicId, setDynamicId }

   
})