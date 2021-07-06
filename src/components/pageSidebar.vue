<template>
    <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary">Latest businesses</span>
            <span class="badge bg-primary rounded-pill">{{ businesses.slice(0,10).length }}</span>
        </h4>
        <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-sm" v-for="business in businesses.slice(0,10).reverse()" :key="business.id">
                {{ business.email }}
            </li>
            
            <li class="list-group-item d-flex justify-content-between">
                <div><strong>Total</strong> (Businesses)</div>
                <strong>{{ businesses.length }}</strong>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed } from 'vue';
export default {
    props: {
        bs: Array
    },
    setup (props) {
        const businesses = computed(() => props.bs)
        return {
            businesses
        }
    }
}
</script>

<style lang="scss" scoped>

</style>