<template>
<form @submit.prevent="formSubmit" class="form-signin mt-5">
    <div class="text-center">
        <img class="mb-4" src="@/assets/bootstrap-logo.svg" alt="" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Please sign <span v-text="page === 'login' ? 'in' : 'up'"></span></h1>
    </div>
    <div class="btn-group mb-3" role="group" aria-label="Basic radio toggle button group" style="width: 100%;">
        <input type="radio" value="login" class="btn-check" v-model="page" id="loginpage" autocomplete="off" :checked="page === 'login'" :disabled="bussy" />
        <label class="btn btn-outline-primary" for="loginpage">Log in</label>
        <input type="radio" value="signup" class="btn-check" v-model="page" id="signuppage" autocomplete="off" :checked="page === 'signup'" :disabled="bussy" />
        <label class="btn btn-outline-primary" for="signuppage">Sign up</label>
    </div>

    <p class="text-danger" v-if="message.length">
        {{ message }}
    </p>
    <div class="form-floating" v-if="page === 'signup'">
        <input type="text" v-model="name" class="form-control" id="floatingInputName" placeholder="John Smith" required :disabled="bussy" />
        <label for="floatingInputName">Name</label>
    </div>
    <div class="form-floating">
        <input type="email" v-model="username" class="form-control" id="floatingInputUsername" placeholder="name@example.com" required :disabled="bussy" />
        <label for="floatingInputUsername">Email</label>
    </div>
    <div class="form-floating">
        <input type="password" v-model="password" class="form-control" id="floatingInputPassword" placeholder="Password" required :disabled="bussy" />
        <label for="floatingInputPassword">Password</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="bussy">Sign in</button>
</form>
</template>

<script>
const providers = require('@/modules/providers/common.json');
const emails = require("email-addresses");
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { signup, signin, update } from "@/modules/sb";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
    setup () {
        const router = useRouter()
        const store = useStore()
        const logged = computed(() => store.getters.logged);
        const bussy = computed(() => store.getters.bussy);
        const username = ref('')
        const password = ref('')
        const name = ref('')
        const page = ref('login');
        const message = ref('');

        async function formSubmit(event) {
            store.dispatch('setBussy', true)
            message.value = ""
            const email = emails.parseOneAddress(username.value);
            var response;
            if(email.domain !== null && providers.includes(email.domain)) {
                if(page.value === 'login') {
                    response = await signin(username.value, password.value);
                    if(response.message) {
                        message.value = response.message
                    }
                } else {
                    response = await signup(username.value, password.value, name.value);
                    if(response.message) {
                        message.value = response.message
                    } else {
                        await update({
                            name: name.value
                        })
                    }
                }
                
            } else {
                message.value = "Email is not valid"
            }
            store.dispatch('setBussy', false)
            
            
        }
        onMounted(() => {
            document.body.className = 'text-center'
            if(logged.value === true) {
                router.push({name: 'Home'})
            }
        })
        onUnmounted(() => {
            document.body.className = 'bg-light'
        })

        watch(logged, (value) => {
            if(value === true) {
                router.push({name: 'Home'})
            }
        })
        return {
            name,
            logged,
            message,
            providers,
            bussy,
            page,
            formSubmit,
            username,
            password
        }
    }
}
</script>

<style lang="scss" scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>