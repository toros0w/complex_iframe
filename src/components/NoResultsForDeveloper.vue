<template>
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 20px;">
        <BlockSvg />
        <span class="text-box">
            В данный момент у вас еще не созданы Жилые комплексы. <br />
            Перейдите в раздел создания.
        </span>
        <a class="go-objects-btn" href="/complexes/#/my-objects">
            Перейти
        </a>
    </div>
</template>
<script setup>
    import BlockSvg from "@/shared/assets/icons/block.vue"
</script>

<style lang="scss">
.text-box
{
    font-size: 18px;
    text-align: center;
}

.go-objects-btn
{
    display: flex;
    padding: 4px 14px;
    line-height: 18px;
    font-size: 16px;
    border: 1px solid #d0d0d0;
    border-radius: 3px;
    color: #237ef7 !important;
    border-color: #3a8efa !important;
    cursor: pointer;
    background: -webkit-linear-gradient(top, #fff, #f5f5f5);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>