<template>
  <div>
    <div class="row" v-if="ready">
      <div class="col-4">
        <div class="d-grid mt-1">
          <button id="startex" class="btn btn-primary btn-lg mb-2" @click="startExtractor" :disabled="bussy">Start Extractor</button>
        </div>
      </div>
      <div class="col-4">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" v-model="selectedServer" :value="true">
          <label class="form-check-label" for="flexRadioDefault1">
            Remote server 
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" v-model="selectedServer" :value="false">
          <label class="form-check-label" for="flexRadioDefault2">
            Local server 
          </label>
        </div>
      </div>
      <div class="col-4">
        <label for="rangeslider" class="form-label">Waiting time is <b>{{ rangeslider }} second{{ (rangeslider !== 1)? 's':'' }}</b></label>
        <input type="range" class="form-range" id="rangeslider" min="0" max="10" step="1" @change="changeSlider" value="1">
      </div>
      <div class="col-12">
        <div class="text-muted">
          <div id="tickerLoader" class="result" role="status"></div>
          <span class="ms-3">{{ currentBusiness }} {{ ticker }}</span>
        </div>
      </div>
      <div class="col-12">
        <ul class="list-group">
          <li v-for="(data, page) in pages" :key="page" class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto w-100">
              <div class="fw-bold w-100">
                <a :href="data.url" target="_blank" style="text-decoration: none;">Page {{ page }}</a>
              </div>
              <div v-for="(comp, index) in data.companies" :key="index">
                <div class="ms-2">
                  <a :href="comp.url" target="_blank">{{ comp.name }}</a>
                  <span class="ms-3"></span>
                  <div :id="'loader-' + page + '-' + index" class="result ms-3" role="status"></div>
                </div>
              </div>
            </div>
            <span class="badge bg-primary rounded-pill">{{ data.companies.length }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Oh snap!</h4>
          <p>It looks like the category or the city location is not set. You must have refreshed the page or something bad happened.</p>
          <hr>
          <p class="mb-0">Click <router-link to="/">here to go back</router-link> and try again.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addBusiness } from '@/modules/sb'
import { api, remoteServer } from '@/modules/functions'
import { useStore } from 'vuex';
import { computed, ref, onMounted, watch } from 'vue'
export default {
  props: {
    category: String,
    city: String,
  },
  setup ({category, city}) {
    const store = useStore()
    const localServer = computed(() => store.getters.localServer)
    const bussy = computed(() => store.getters.bussy)
    const pages = computed(() => store.getters.queue)
    const uid = computed(() => store.getters.user.id)
    const ready = computed(() => (category !== undefined && city !== undefined) )
    const ticker = ref("");
    const currentBusiness = ref("");
    const rangeslider = ref(1);
    const classname = {
      result: 'result',
      spinner: 'spinner-border',
    };

    const server = computed(() =>
      store.getters.remote
          ? remoteServer
          : localServer.value
      );

    const selectedServer = ref(store.getters.remote)
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    function changeSlider(event) {
      rangeslider.value = parseInt( event.target.value )
    }
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    
    async function startExtractor() {
      store.dispatch('setBussy', true);
      document.querySelector('#tickerLoader').className = classname.spinner;
      for await (const [page, data] of Object.entries(pages.value)) {
        const arrays = data.companies;
        arrays.forEach((element, index) => {
          const id = `#loader-${page}-${index}`;
          const loader = document.querySelector(id)
          loader.innerHTML = 'waiting ..'
        });

        const finish = await asyncForEach(arrays, async (num, i) => {
          const id = `#loader-${page}-${i}`;
          const loader = document.querySelector(id)
          loader.innerHTML = '';
          loader.className = classname.spinner;
          if(page !== 1 && i !== 0) {
            await waitFor(rangeslider.value * 1000);
          } else {
            ticker.value = 'starting ..';
            console.log('Now its starting');
          }
          const data = await extract(num.url);
          
          loader.className = classname.result;
          loader.style.width = 'auto';
          if(data.message === "Success") { 
            num.email = data.data
            num.category = category
            num.city = city
            num.user_id = uid.value
            const {success, error} = await addBusiness(num);
            if(error === null) {
              loader.innerHTML = '<span class="text-success">' + num.email + '<span>';
              ticker.value = num.email + ' extracted'
            } else {
              loader.innerHTML = '<span class="text-warning">' + num.email + ' <strong>duplicate</strong><span>';
              ticker.value = num.email + ' duplicate'
            }
            
          } else {
            loader.innerHTML = '<span class="text-danger">no email<span>';
            ticker.value = 'no email'
          }
          currentBusiness.value = "Extracting: " + num.name;
        })
        
      }
      store.dispatch('setBussy', false);
      ticker.value = 'Done!';
      document.querySelector('#tickerLoader').className = classname.result;
      currentBusiness.value = "";
    }

    async function extract(url) {
      let apiget = await api(server.value + '/email/' + btoa(url))
      apiget = await apiget.data
      return apiget
    }
    watch(selectedServer, (value) => {
      store.dispatch('setRemote', value)
    })
    return {
      selectedServer,
      currentBusiness,
      ticker,
      ready,
      changeSlider,
      rangeslider,
      bussy,
      startExtractor,
      pages,
    }
  }
}
</script>

<style lang="scss" scoped>
div.result {
  width: 100%; height: 1rem;
  display: inline !important;
}
div.spinner-border {
  width: 1rem; height: 1rem;
}
</style>
