<!-- Tabs.vue -->
<template>
    <div class="tabs">
      <div class="tab-block">
        <ul>
            <li
                v-for="(tab, index) in listTabs"
                :key="index"
                :class="`${activeTab === index ? 'active' : ''}${ !tab.visible ? 'is_not_visible' : ''}`"
                @click="selectTab(index)"
            >
                <span v-html="tab.icon"></span>
                <span>
                    {{ tab.label }}
                </span>
                <span v-if="tab.count" class="count">
                    {{ tab.count > 9 ? '9+' : tab.count }}
                </span>
            </li>
        </ul>
        <slot name="custom-tab"></slot>
      </div>
  
      <!-- Display the content of the active tab -->
      <div class="tab-content">
        <slot :name="'tab-' + activeTab"></slot>
      </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

// Define props to accept tabs array from the parent component
const props = defineProps({
    tabs: {
        type: Array,
        required: true
    },
    onClickTab: {
        type: Function,
        required: false,
        default: () => {}
    }
});

const listTabs = computed(() => {
    if (!props.tabs[activeTab.value].visible)
    {
        activeTab.value = 0
    }
    
    return props.tabs
})

// Active tab state
const activeTab = ref(0);

// Function to change the active tab
function selectTab(index) {
    activeTab.value = index;

    props.onClickTab()
}
</script>

<style scoped>
.tabs {
    height: 100%;
    width: 100%;
}

.tab-block {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dedede;
}

.tab-block ul {
    font-size: 16px;
    list-style: none;
    padding: 0;
    display: flex;
}

.tab-block ul li {
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
}

.tab-block ul li.active {
    /* background-color: #f0f8ff; */
    border-bottom: 2px solid #4caf50;
    fill: #4caf50;
    color: #4caf50;
}

.tab-block ul li .count {
    background-color: #4caf50;
    color: white;
    border-radius: 50%;
    height: 24px;
    width: 26px;
    margin-left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.tab-content {
    height: 95%;
}

.is_not_visible {
    display: none !important;
}
</style>
