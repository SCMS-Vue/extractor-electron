<template>
  <div>
    <header>
      <div class="row">
        <div class="col">
          <div class="btn-group w-100 menutop" role="group" aria-label="Basic example">
            <router-link v-if="logged" :to="{name: 'Home'}" class="btn btn-dark btn-sm" id="home-link">
              <i class="bi bi-house"></i>
              <label for="home-link" class="ms-2">Home</label>
            </router-link>
            <router-link v-if="logged" :to="{name: 'Results'}" class="btn btn-dark btn-sm" id="results-link">
              <i class="bi bi-list-ul"></i>
              <label for="results-link" class="ms-2">Results</label>
            </router-link>
            <router-link v-if="!logged" :to="{name: 'Auth'}" class="btn btn-dark btn-sm" id="auth-link">
              <i class="bi bi-person-plus"></i>
              <label for="auth-link" class="ms-2">Log in</label>
            </router-link>
            <a v-else class="btn btn-dark btn-sm" href="#" @click.prevent="logout" id="auth-link">
              <i class="bi bi-person-x"></i>
              <label for="auth-link" class="ms-2">Log out</label>
            </a>
          </div>
        </div>
      </div>
    </header>
    <layout-default>
      <router-view class="mt-3" />
    </layout-default>
    <footer>
      <div class="row">
        <div class="col-4 text-start text-muted text-small ms-2">
            <div v-if="bussy">
              <span class="spinner-grow" role="status" style="width: 1rem; height: 1rem; vertical-align: -0.21em;"></span>
              <code class="ms-2">Bussy</code>
            </div>
            <div v-else>
              <code class="ms-2">Ready</code>
            </div>
        </div>
        <div class="col-3 text-center text-small">
          <code>&copy; {{ year }} Business Inc.</code>
        </div>
        <div class="col-4 text-end text-small">
          <img src="./assets/php-logo.svg" alt="php" style="width: 24px; height auto;"><code class="ms-2">{{ localServer }}</code>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, watch, onMounted } from 'vue';
import { logout } from '@/modules/sb';
export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const logged = computed(() => store.getters.logged);
    const bussy = computed(() => store.getters.bussy);
    const localServer = computed(() => store.getters.localServer)

    watch(logged, (islogged) => {
      if(islogged === false) router.push({name: 'Auth'})
    })

    onMounted(() => {
      window.ipcRenderer.send('ping');
      setInterval(() => {
        window.ipcRenderer.send('ping')
      }, 10000)

      window.ipcRenderer.receive('pong', ({host, port}) => {
        const localhost = `http://${host}:${port}`
        store.dispatch('setLocalHostUrl', localhost);
        console.log(localServer.value);
      })
    })
    return {
      localServer,
      bussy,
      logged,
      logout,
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss">
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
</style>
