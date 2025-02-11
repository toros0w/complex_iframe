<template>
  <table
    class="tableFromFile flex flex-col overflow-x-scroll"
    @dragover.prevent
  >
    <thead
      :class="[
        'w-max grid text-center bg-[#F2F3F3]',
        `grid-cols-[30px_repeat(9,_1fr)]`,
      ]"
      :style="`grid-template-columns: 30px repeat(${props.data.head.length}, 1fr);`"
    >
      <tr class="flex justify-center border border-b-0 border-grey-400"></tr>
      <tr
        v-for="(row, indexRow) in props.data.head"
        :key="indexRow"
        class="flex justify-center border border-b-0 border-grey-400 w-max"
      >
        <td class="min-w-[250px] max-w-[250px]">{{ row }}</td>
      </tr>
    </thead>
    <tbody
      :class="['w-max grid text-center', `grid-cols-[30px_repeat(9,_1fr)]`]"
      :style="`grid-template-columns: 30px repeat(${props.data.head.length}, 1fr);`"
    >
      <tr
        class="grid grid-cols-1"
        :class="[`grid-rows-[repeat(${props.data.body[0].items.length},_1fr)]`]"
      >
        <td
          v-for="(cell, indexCell) in props.data.body[0].items"
          :key="indexCell"
          class="border border-grey-400 flex items-center justify-center px-2 main-tds"
        >
          {{ indexCell }}
        </td>
      </tr>
      <tr
        v-for="(col, indexCol) in props.data.body"
        :key="indexCol"
        class="grid grid-cols-1 w-max border-x border-grey-400"
        :class="[`grid-rows-[repeat(${col.items.length},_1fr)]`, props.data.body[indexCol].items[0] == null ? '' : 'edit-table-tr']"
        @dragstart="(e) => onDragStart(e, indexCol)"
        @dragover.stop
        @dragend="(e) => dragEndHandler(e)"
        @drop.prevent="(e) => emits('onDrop', e, indexCol)"
        draggable="true"
        style="display: flex; position: relative; flex-direction: column; justify-content: space-between;">
        <td
          v-for="(cell, indexCell) in col.items"
          :key="indexCell"
          class="border border-x-0 border-grey-400 flex items-center justify-center min-w-[250px] max-w-[250px]"
          style="flex: 1; overflow: hidden"
        >
          {{ cell }}

          <svg style="position: absolute; right: 0; top: 0;" v-if="indexCell == 0 && cell" xmlns="http://www.w3.org/2000/svg" fill="#acacac" width="24px" height="24px" viewBox="0 0 1024 1024" class="icon">
            <path d="M909.3 506.3L781.7 405.6a7.23 7.23 0 0 0-11.7 5.7V476H548V254h64.8c6 0 9.4-7 5.7-11.7L517.7 114.7a7.14 7.14 0 0 0-11.3 0L405.6 242.3a7.23 7.23 0 0 0 5.7 11.7H476v222H254v-64.8c0-6-7-9.4-11.7-5.7L114.7 506.3a7.14 7.14 0 0 0 0 11.3l127.5 100.8c4.7 3.7 11.7.4 11.7-5.7V548h222v222h-64.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V548h222v64.8c0 6 7 9.4 11.7 5.7l127.5-100.8a7.3 7.3 0 0 0 .1-11.4z"/>
          </svg>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ITableData } from "@/widgets/importSteps/fieldStep.vue";

const props = defineProps({
  data: ITableData
});
const emits = defineEmits(
  ["onDrop"]
);

const onDragStart = (event, index) => {
  if (event.dataTransfer)
    event.dataTransfer.setData("col_id", index.toString());
};

const dragEndHandler = (event) => {
  // 
};
</script>

<style scoped lang="scss">
table {
  td {
    margin: 0;
    font-size: 14px;
    max-height: 46px !important;
  }
}

.edit-table-tr {
  cursor: pointer
}
.edit-table-tr:hover {
  background: #E4F8F0 !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
}

.tableFromFile {
  user-select: none;
}
</style>

