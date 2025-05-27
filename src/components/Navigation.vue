<template>
    <div class="navigation-container" v-if="pages.length">
        <div class="breadcrumbs">
            <router-link
                v-if="pages.length > 1"
                :to="pages[pages.length - 2].path"
                class="back-step"
            >
                <svg fill="none" viewBox="0 0 16 10" height="18" width="20" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(-1, 1) translate(-15, 0)">
                        <path fill="#02076F" d="M15.2069 4.864L10.6149 9.456L10.0789 8.896C9.96688 8.77867 9.92154 8.664 9.94288 8.552C9.96421 8.43467 10.0282 8.32267 10.1349 8.216L12.2629 6.096C12.5242 5.83467 12.7642 5.61867 12.9829 5.448C12.6949 5.48533 12.3935 5.51467 12.0789 5.536C11.7642 5.55733 11.4389 5.568 11.1029 5.568H0.974875V4.144H11.1029C11.4389 4.144 11.7642 4.15467 12.0789 4.176C12.3989 4.19733 12.7029 4.22933 12.9909 4.272C12.7722 4.096 12.5295 3.87733 12.2629 3.616L10.1189 1.48C10.0122 1.37333 9.94821 1.264 9.92688 1.152C9.90554 1.03467 9.95088 0.917333 10.0629 0.799999L10.5989 0.24L15.2069 4.864Z"></path>
                    </g>
                </svg>
            </router-link>
            <div class = "breadcrumbs-links">
                <router-link
                v-for="(page, index) in pages"
                :key="index"
                :to="index === pages.length - 1 ? null : page.path"
                :class="{'active-step': index === pages.length - 1}"
                >
                {{ page.name }}
                <!-- <svg v-if="index < (pages.length - 1)" xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 16 10" fill="none">
                    <path d="M15.2069 4.864L10.6149 9.456L10.0789 8.896C9.96688 8.77867 9.92154 8.664 9.94288 8.552C9.96421 8.43467 10.0282 8.32267 10.1349 8.216L12.2629 6.096C12.5242 5.83467 12.7642 5.61867 12.9829 5.448C12.6949 5.48533 12.3935 5.51467 12.0789 5.536C11.7642 5.55733 11.4389 5.568 11.1029 5.568H0.974875V4.144H11.1029C11.4389 4.144 11.7642 4.15467 12.0789 4.176C12.3989 4.19733 12.7029 4.22933 12.9909 4.272C12.7722 4.096 12.5295 3.87733 12.2629 3.616L10.1189 1.48C10.0122 1.37333 9.94821 1.264 9.92688 1.152C9.90554 1.03467 9.95088 0.917333 10.0629 0.799999L10.5989 0.24L15.2069 4.864Z" fill="#7D7D7D"/>
                </svg> -->
                <span v-if="index < (pages.length - 1)"> &nbsp; &#x5c; &nbsp;</span>
            </router-link>
        </div>
            <span class="lw-text lw-text--medi lw-text--success" v-if="isActiveApartment">{{ apartmentInfo }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNavigateStore } from "@/app/store/navigate";

const navigateStore = useNavigateStore();

console.log(navigateStore, 'NAVIGATESTORE');

const pages = computed(() => navigateStore.pages);
console.log(pages, 'pages');
</script>


<style lang="scss" scoped>
.navigation-container {
    padding-bottom: 20px;

    .breadcrumbs {
        display: flex;
        align-items: center; // Align items vertically
        gap: 10px; // Increase gap for better spacing
        padding: var(--main-offset) 0;
        justify-content:center;
        margin-top: 30px;
        .ggg{
            transform:rotateZ(-180deg) !important;
        }
        .breadcrumbs-links{
            display:flex;
            flex-wrap:wrap;
            width:90%;
            transform:translatex(20px)
            a{
                font-size:14px;
            }
        }
        .router-link-active {
            display: flex;
            align-items: center;
            color: #7d7d7d;
            font-weight: 500;
            font-size: 14px;
            text-decoration: none;
            border-bottom: none !important;
            
            svg {
                /* margin-left: 10px */
            }
        }

        .router-link-exact-active,
        .active-step {
            color: #02076F;
            pointer-events: none; // Disable pointer events
            cursor: default;

            &:hover {
                color: #02076F !important;
            }
        }
    }
}
</style>
