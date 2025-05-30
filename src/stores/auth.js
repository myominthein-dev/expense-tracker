import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useAuthStore = defineStore('auth' , () => {
    const isShowSignIn = ref(false)
    const isShowSignUp = ref(false)
    const authenticatedUser = ref(null)
    const authenticatedUserInfo = ref(null)

    const getStatusSignIn = computed(() => isShowSignIn.value)
    const getStatusSignUp = computed(() => isShowSignUp.value)

    const getAuthenticatedUser = computed(() => authenticatedUser.value)
    const getAuthenticatedUserInfo = computed(() => authenticatedUserInfo.value)

   


    const changeStatusSignIn = () => {
        isShowSignIn.value = !isShowSignIn.value
    }

    const changeStatusSignUp = () => {
        isShowSignUp.value = !isShowSignUp.value
    }

    const setAuthenticatedUser = (authUser) => {
        authenticatedUser.value = authUser
    }

     const setAuthenticatedUserInfo = (profile) => {
        authenticatedUserInfo.value = profile
    }

    const resetAuthenticatedUser = () => {
        authenticatedUser.value = null
    }
    const resetAuthenticatedUserInfo = () => {
        authenticatedUserInfo.value = null
    }

    return {isShowSignIn, getStatusSignIn, changeStatusSignIn, isShowSignUp, getStatusSignUp, changeStatusSignUp,authenticatedUser, getAuthenticatedUser, setAuthenticatedUser, resetAuthenticatedUser, getAuthenticatedUserInfo,setAuthenticatedUserInfo,resetAuthenticatedUserInfo, authenticatedUserInfo}
})