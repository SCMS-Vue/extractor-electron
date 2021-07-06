<template>
  <div class="row">
    <div class="col-12">
      <h4>Results</h4>
    </div>
    <div class="col-12 mb-2">
      <a href="#" :class="{'active' : type === 'list'}" @click.prevent="type = 'list'">List</a> |
      <a href="#" :class="{'active' : type === 'json'}" @click.prevent="type = 'json'">Json</a> |
      <a href="#" :class="{'active' : type === 'csv'}" @click.prevent="type = 'csv'">Csv</a> |
      <a href="#" :class="{'active' : type === 'text'}" @click.prevent="type = 'text'">Text</a>
    </div>
    <div class="col-12">
      <ul class="list-group mb-3" v-if="type === 'list'">
        <li class="list-group-item d-flex justify-content-between lh-sm" v-for="business in data.businesses" :key="business.id">
            <div>
                <h6 class="my-0">{{ business.name }}</h6>
                <small class="text-muted">{{ business.category }}</small>
                <small class="text-muted ms-2">
                  <a v-if="business.url" :href="business.url" target="_blank">VISIT</a>
                  <span v-else>NO URL</span>
                </small>
            </div>
            <div>
                <span class="text-muted d-block text-end">{{ business.city }}</span>
                <span class="text-muted">{{ business.email }}</span>
            </div>
        </li>
        
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (Businesses)</span>
            <strong>{{ data.businesses.length }}</strong>
        </li>
      </ul>
      <pre v-if="type === 'json'">{{ data.businesses }}</pre>
      <div v-if="type === 'text'" v-for="business in data.businesses" :key="business.id">{{ business.email }}</div>
      <div v-if="type === 'csv'">
        <div>name,company,category,city,email</div>
        <div v-for="business in data.businesses" :key="business.id">
          "{{business.name}}","{{business.name}}","{{business.category}}","{{business.city}}",{{business.email}}
        </div>
      </div>
      
    </div>
    
    
  </div>
</template>
<script>
import { api } from '@/modules/functions'
import { onMounted, ref, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { businesses } from '@/modules/sb'

export default {
  name: 'Results',
  setup() {
    const store = useStore()
    const bussy = computed(() => store.getters.bussy)
    const data = reactive({
      businesses: [],
    });
    const type = ref('list');

    async function refreshDB() {
      await businesses().then(ress => data.businesses = ress)
      store.dispatch('setBussy', false);
    }
    onMounted(() => {
      store.dispatch('setBussy', true);
      refreshDB();
    });

    return {
      type,
      data
    }
  }
}
</script>

<style lang="scss">
// .list-group {
//     max-height: 600px;
//     overflow:scroll;
//     -webkit-overflow-scrolling: touch;
// }
div a.active {
  text-decoration: none;
  cursor: not-allowed;
}
</style>
