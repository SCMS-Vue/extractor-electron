<template>
<div>
    <!-- Modal -->
    <div class="modal fade" id="addCityModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCityModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title" id="addCityModalLabel">Add new city</h5>
                        <button id="citmodal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                            <label for="city-label" class="form-label">Category / Type / Place {{ selectedPlace }}</label>
                            <div class="input-group mb-3">
                                <select class="form-select" v-model="selectedCat">
                                    <option selected disabled>Category...</option>
                                    <option v-for="ccat in categories" :key="ccat.id" :value="ccat.URL" >{{ ccat.name }}</option>
                                </select>
                                <select class="form-select" v-model="selectedPlace">
                                    <option value="provincia">Provincia</option>
                                    <option value="localidad">Localidad</option>
                                </select>
                                <input required type="text" class="form-control" id="city-label" aria-describedby="basic-addon1" v-model="city" :disabled="bussy || response.status === 200">
                                <span class="input-group-text">/</span>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <span v-if="response.message.length">{{ response.message }}</span>
                        <span v-if="exists">Already in database</span>
                        <button @click="testURL('city', selectedPlace + '/' + city)" type="button" class="btn btn-dark" :disabled="bussy || response.status === 200 || exists">Test</button>
                        <button @click="submitForm('city')" v-if="response.status === 200" type="button" class="btn btn-primary" :disabled="bussy">Save to DB</button>
                        <button v-if="response.status === 200" type="button" class="btn btn-text" :disabled="bussy" @click="resetForm">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="addCategoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title" id="addCategoryModalLabel">Add new category</h5>
                        <button id="catmodal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                            <label for="basic-url" class="form-label">Your vanity URL</label>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon3">https://empresite.eleconomista.es/Actividad/</span>
                                <input required type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3" v-model="category" :disabled="bussy || response.status === 200">
                                <span class="input-group-text">/</span>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <span v-if="response.message.length">{{ response.message }}</span>
                        <span v-if="exists">Already in database</span>
                        <button @click="testURL('category', 'https://empresite.eleconomista.es/Actividad/' + category + '/')" type="button" class="btn btn-dark" :disabled="bussy || response.status === 200 || exists">Test</button>
                        <button @click="submitForm('category')" v-if="response.status === 200" type="button" class="btn btn-primary" :disabled="bussy">Save to DB</button>
                        <button v-if="response.status === 200" type="button" class="btn btn-text" :disabled="bussy" @click="resetForm">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { addcat, addcit } from '@/modules/sb'
import { api, remoteServer } from '@/modules/functions'
import { ref, watch, computed, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
    props: {
        data: Object
    },
    emits: ['accepted'],
    setup (props, { emit }) {
        const store = useStore()
        const categories = computed(() => props.data.categories)
        const cities = computed(() => props.data.cities)
        const bussy = computed(() => store.getters.bussy)
        const localServer = computed(() => store.getters.localServer)
        const selectedPlace = ref('provincia')
        const category = ref('')
        const selectedCat = ref('')
        const city = ref('')
        const status = ref(0);
        const exists = ref(false);
        const response = reactive({
            data: "",
            message: "",
            status: 0
        })
        const server = computed(() =>
        store.getters.remote
            ? remoteServer
            : localServer.value
        );
        async function testURL(what, url) {
            if(url.length) {
                store.dispatch('setBussy', true);
                if(what === 'city') {
                    url = selectedCat.value + url + '/'
                }
                console.log(url)
                const apires = await api(server.value + '/test/' + btoa(url))
                const data = apires.data
                Object.assign(response, data)
                console.log(response)
                store.dispatch('setBussy', false)
            }
        }
        async function submitForm(what = 'category') {
            store.dispatch('setBussy', true);
            var response, ob;
            if(what === 'city') {
                ob = {
                    name: city.value,
                    path: selectedPlace.value + '/' + city.value + '/'
                }
                response = await addcit(ob);
            } 
            if(what === 'category') {
                ob = {
                    name: category.value,
                    url: 'https://empresite.eleconomista.es/Actividad/' + category.value + '/'
                }
                response = await addcat(ob);
            }
            
            if(response.data && response.data.length) {
                resetForm();
                document.querySelector('#catmodal').click();
                document.querySelector('#citmodal').click();
                emit('accepted');
            }
            store.dispatch('setBussy', false)
            
        }
        function resetForm() {
            Object.assign(response, { data: "", message: "", status: 0 })
        }
        watch(category, (value) => {
            if(value.length) {
                category.value = value.toUpperCase().replace(/\s/g, '').replace(/[0-9]/g, '');
                const cats = categories.value.filter(arr => arr.name === category.value)
                if(cats.length) {
                    exists.value = true
                }
                else {
                    exists.value = false
                }
            }
        })
        watch(city, (value) => {
            if(value.length) {
                city.value = value.toUpperCase().replace(/\s/g, '').replace(/[0-9]/g, '');
                const cits = cities.value.filter(arr => arr.name === city.value)
                if(cits.length) {
                    exists.value = true
                }
                else {
                    exists.value = false
                }
            }
        })
        onMounted(() => {
            setTimeout(() => {
                selectedCat.value = categories.value[0].URL
            }, 1000)
        })
        return {
            selectedPlace,
            selectedCat,
            categories,
            city,
            submitForm,
            resetForm,
            exists,
            testURL,
            response,
            bussy,
            category
        }
    }
}
</script>

<style lang="scss" scoped>

</style>