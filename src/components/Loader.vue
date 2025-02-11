<template>
    <div class="linear-loader-container">
        <div class="linear-loader"></div>
    </div>
</template>


<style lang="scss" scoped>
.linear-loader-container {
    width: 100%;
    height: 10px;
    background-color: #f3f3f3;
    position: relative;
    overflow: hidden;
    border-radius: 10px;

    .linear-loader {
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, #3498db 25%, #f3f3f3 50%, #3498db 75%);
        background-size: 200% 100%;
        animation: loading 1s linear infinite;
    }
}


@keyframes loading {
    0% {
        background-position: 100% 0;
    }
    100% {
        background-position: -100% 0;
    }
}
</style>