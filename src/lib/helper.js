import { useAuthStore } from "@/stores/auth";
import { supabase } from "./supabaseClient";
import { useExpenseStore } from "@/stores/expense";
import router from "@/router";


export const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Yangon',
})

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Yangon',
  });
}

export const fetchExpenses = async () => {

const expenseStore  = useExpenseStore();
  
  const {data:{user}, error} = await supabase.auth.getUser();

  if (!error) {
   
    const {data} = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id);
      
      expenseStore.setExpenses(data);
    
  }
}

export const getUserInfo = async (id) => {

  let { data: userInfo, error } = await supabase
    .from('users')
    .select('*')
    .eq('id',id).single()

  return userInfo;
}

export const setAuthInfo = async (path) => {
  const authStore = useAuthStore();

  const { data: { user } ,error} = await supabase.auth.getUser();
  
  if (!error) {
   const userInfo = await getUserInfo(user.id);
   if (userInfo) {
    const userData = {
      name: userInfo.full_name,
      joinedDate: new Date(userInfo.created_at).toLocaleDateString(),
    }
    authStore.setAuthenticatedUserInfo(userData)
  }

}
}

export const isAuthenticated = (path) => {
  const authStore = useAuthStore();

if (authStore.getAuthenticatedUserInfo) {
    router.push(path || '/')

  } else {
    router.push('/guest')
  }
}