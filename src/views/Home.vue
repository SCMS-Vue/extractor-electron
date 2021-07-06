<template>
<div>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="alert alert-warning alert-dismissible fade" :class="{'show': test === 201, 'hide': test !== 201}" role="alert">
          <strong>Holy shit!</strong> {{ response }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div class="alert alert-success alert-dismissible fade" :class="{'show': test === 200, 'hide': test !== 200}" role="alert">
          <strong>Nice!</strong> {{ response }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  </div>
  <div class="row g-5">
    <page-sidebar :bs="data.businesses"></page-sidebar>
    <div class="col-md-7 col-lg-8">
      <h4 class="mb-3">Extractor data</h4>
      <form class="needs-validation" novalidate="" @submit.prevent="testURL" @reset="test = 0; response = '';">
          <div class="row g-3">
            <div class="col-7">
              <div class="form-floating mb-2">
                <select class="form-select" id="categories" aria-label="Select category" v-model="category" :disabled="bussy">
                  <option value="" disabled>Select category</option>
                  <option v-for="cat in data.categories" :key="cat.id" :value="cat.URL">{{ cat.name }}</option>
                </select>
                <label for="categories">Select category</label>
              </div>
              <div><a href="#" class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#addCategoryModal">Add category</a></div>
            </div>
            <div class="col-5">
              <div class="form-floating mb-2">
                <select class="form-select" id="cities" aria-label="Select city" v-model="city" :disabled="bussy">
                  <option value="" disabled>Select city</option>
                  <option v-for="cit in data.cities" :key="cit.id" :value="cit.path">{{ cit.name }}</option>
                </select>
                <label for="cities">Select city</label>
              </div>
              <div><a href="#" class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#addCityModal">Add city</a></div>
            </div>
          </div>
          <hr class="my-4"  v-if="url.length"/>
          <div class="row" v-if="url.length">
            <div class="col-1">
              <span class="text-success" v-if="test === 200">
                <i class="bi bi-emoji-sunglasses"></i>
              </span>
              <span class="text-danger" v-if="test === 201">
                <i class="bi bi-exclamation-circle"></i>
              </span>
              <span class="text-primary" v-if="test === 0">
                <i class="bi bi-question-lg"></i>
              </span>
            </div>
            <div class="col-11 text-truncate">
              <a :class="{ 'text-success': test === 200, 'text-danger': test === 201, }" target="_blank" :href="url">{{ url }}</a>
            </div>
          </div>
          <hr class="my-4" />
          <div class="row">
            <div class="col-9">
                <button v-if="test === 0 || test === 201" class="w-100 btn btn-primary btn-lg" type="submit" :disabled="bussy || !url.length || !category.length || !city.length">
                  <div v-if="bussy" class="spinner-grow" role="status" style="width: 1.5rem; height: 1.5rem; vertical-align: -0.21em;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-if="bussy" class="ms-2"> Testing ... </span>
                  <span v-else> Test URL </span>
                </button>
                <button v-if="test === 200" class="w-100 btn btn-info btn-lg" type="button" :disabled="bussy" @click="startExtract">
                  <div v-if="bussy" class="spinner-grow" role="status" style="width: 1.5rem; height: 1.5rem; vertical-align: -0.21em;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-if="bussy" class="ms-2"> Extracting ... </span>
                  <span v-else> Extract Businesses </span>
                </button>
            </div>
            <div class="col-3">
              <button class="w-100 btn btn-secondary btn-lg" type="reset" :disabled="bussy">
                <span > Reset </span>
              </button>
            </div>
            <div class="col-12 mt-2">
              <label for="form-check">Server:</label>
              <div class="form-check form-check-inline ms-3">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" v-model="selectedServer" :value="true">
                <label class="form-check-label" for="flexRadioDefault1">
                  Remote 
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" v-model="selectedServer" :value="false">
                <label class="form-check-label" for="flexRadioDefault2">
                  Local
                </label>
              </div>
              <code>{{ server }}</code>
            </div>
          </div>
      </form>
    </div>
  </div>
  <!-- <div class="row">
    <div class="col">
      <pre>
        {{ data }}
      </pre>
    </div>
  </div> -->
  <modals :data="data" @accepted="refreshDB"></modals>
</div>
</template>

<script>
import { api, remoteServer } from '@/modules/functions'
import { onMounted, ref, computed, watch, reactive } from 'vue'
import pageSidebar from '@/components/pageSidebar'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { businesses, categories, cities } from '@/modules/sb'
import Modals from '@/components/Modals';

export default {
  name: 'Home',
  components: {
    pageSidebar,
    Modals,
  },
  setup() {
    const router = useRouter()
    const data = reactive({
      businesses: [],
      categories: [],
      cities: [],
    })
    const store = useStore()
    const localServer = computed(() => store.getters.localServer)
    const bussy = computed(() => store.getters.bussy)
    const user = computed(() => store.getters.user)
    const test = ref(0);
    const response = ref('');
    const responsedata = ref(null)
    const selectedCat = ref(null)
    const selectedCit = ref(null)
    const category = ref('')
    const city = ref('')
    const server = computed(() =>
      store.getters.remote
        ? remoteServer
        : localServer.value
    );
    const selectedServer = ref(store.getters.remote)
    const url = computed(() => category.value + city.value)
    
    async function startExtract() {
      store.dispatch('setBussy', true);
      responsedata.value = await api(server.value + '/loop/' + btoa(url.value))
      responsedata.value = await responsedata.value.data
      const pages = responsedata.value.pages
      store.dispatch("setQueue", pages)
      setTimeout(() => {
        store.dispatch('setBussy', false);
        console.log("Pages", pages)
        router.push({
          name: 'Businesses', params: {
            category: selectedCat.value,
            city: selectedCit.value,
          } 
        }, 300)
      })
      
      
    }
    async function testURL() {
      const msg = 'Hemos Encontrado {num} Resultados';
      store.dispatch('setBussy', true);
      const apires = await api(server.value + '/test/' + btoa(url.value))

      response.value = apires.data.message;
      test.value = apires.data.status;
      store.dispatch('setBussy', false)
    }

    function refreshDB() {
      businesses().then(ress => data.businesses = ress);
      cities().then(ress => data.cities = ress);
      categories().then(ress => data.categories = ress);
    }
    watch(category, (value) => {
      const name = data.categories.filter(cc => cc.URL === value);
      selectedCat.value = name.length ? name[0].name : 'NONE';
      test.value = 0;
      response.value = '';
    })
    watch(city, (value) => {
      const name = data.cities.filter(cc => cc.path === value);
      selectedCit.value = name.length ? name[0].name : 'NONE';
      test.value = 0;
      response.value = '';
    })
    watch(selectedServer, (value) => {
      console.log(store.getters.remote)
      console.log(server.value)
      store.dispatch('setRemote', value)
    })
    onMounted(() => {
      refreshDB();
    });
    return {
      refreshDB,
      url,
      data,
      user,
      responsedata,
      startExtract,
      response,
      testURL,
      bussy,
      test,
      category,
      city,
      categories,
      cities,
      selectedServer,
      server
    }
    }
}
</script>
