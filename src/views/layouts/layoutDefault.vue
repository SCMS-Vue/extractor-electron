<template>
<main v-if="$route.meta.defaultLayout">
    <div class="container-fluid">
        <slot />
    </div>
</main>
<main v-else>
    <slot />
</main>
</template>

<style lang="scss">
html, body, #app {
    height: 100% !important;
    width: 100%  !important;;
}
.bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

@media (min-width: 768px) {
    .bd-placeholder-img-lg {
        font-size: 3.5rem;
    }
}
</style>