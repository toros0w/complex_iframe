<template>
  <table
    class="tableEditeble flex flex-col overflow-x-scroll"
    @dragover.prevent
    >
    <!-- @drop.prevent="(e) => emits('onDrop', e)" -->
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
        <td class="min-w-[250px] max-w-[250px]">{{ row.label }}</td>
      </tr>
    </thead>
    <tbody
      ref="bodyRef"
      :class="[
        'min-h-[200px] min-w-full w-max grid text-center border-t border-x border-grey-400',
        `grid-cols-[30px_repeat(9,_1fr)]`,
      ]"
      :style="`grid-template-columns: 30px repeat(${props.data.head.length}, 1fr);`"
    >
      <tr
        class="grid grid-cols-1 border-r border-grey-400"
        :class="[`grid-rows-[repeat(${props.data.body[0].items.length},_1fr)]`]"
      >
        <td
          v-for="(cell, indexCell) in props.data.body[0].items"
          :key="indexCell"
          class="border border-grey-400 flex items-center justify-center px-2"
        >
          {{ indexCell }}
        </td>
      </tr>
      <tr
        v-for="(col, indexCol) in props.data.head"
        :key="indexCol"
        class="grid grid-cols-1 min-w-[251px] w-max border-x border-grey-400"
        :class="[`grid-rows-[repeat(${col.length},_1fr)]`, props.data.body[indexCol].items[0] == null ? '' : 'edit-table-tr']"
        style="display: flex; position: relative; flex-direction: column; justify-content: space-between;"
        @dragover="(e) => dragOverHandler(e)"
        @drop.prevent="(e) => dragEndHandler(e, indexCol)"
        @dragleave="(e) => dragLeaveHandler(e)"
        >
        <td
          v-for="(cell, indexCell) in props.data.body[indexCol].items"
          :key="indexCell"
          class="border border-x-0 border-grey-400 flex items-center justify-center min-w-[250px] max-w-[250px] py-3"
          style="flex: 1; overflow: hidden"
        >
          {{ cell }}
          <img
            @click="$emit('onRemoveDropped', $event, indexCol, props.data.body[indexCol])"
            style="position: absolute; right: 0; top: 0; cursor: pointer;"
            v-if="indexCell == 0 && cell"
            src="@/shared/assets/images/complexes/close.svg"
            alt=""
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ITableData } from "@/widgets/importSteps/fieldStep.vue";
import { ref } from "vue";

const props = defineProps({
  data: ITableData,
});

const bodyRef = ref()

const emits = defineEmits(["onDrop", "onRemoveDropped"]);


const dragOverHandler = (e) => {
  e.target.closest('tr').style.backgroundColor = "#FFFBE3";
};
const dragEndHandler = (e, index) => {
  e.target.closest('tr').style.backgroundColor = "#ffffff";
  emits('onDrop', e, index)
};

const dragLeaveHandler = (e) => {
  e.target.closest('tr').style.backgroundColor = "#ffffff";
}
</script>

<style scoped lang="scss">
table {
  & * {
    box-sizing: border-box;
  }
  td {
    margin: 0;
    font-size: 14px;
    max-height: 46px !important;
  }
}

.edit-table-tr {
  cursor: pointer;
}
.edit-table-tr:hover {
  background: #E4F8F0 !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
}

.tableEditeble {
  user-select: none;
}
</style>
