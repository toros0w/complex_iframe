<template>
  <div class="fieldStep">
    <div class="fieldStep__content flex flex-col">
      <Message :closable="false" severity="success">
        <template #messageicon>
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
            <path
              d="M10.2989 0.388749C10.2292 0.318453 10.1463 0.262657 10.0549 0.224581C9.96348 0.186504 9.86545 0.166901 9.76644 0.166901C9.66743 0.166901 9.5694 0.186504 9.47801 0.224581C9.38662 0.262657 9.30367 0.318453 9.23394 0.388749L3.64644 5.98375L1.29894 3.62875C1.22655 3.55882 1.14109 3.50384 1.04745 3.46693C0.953812 3.43003 0.853819 3.41193 0.753184 3.41367C0.652548 3.41541 0.553241 3.43696 0.460932 3.47708C0.368623 3.5172 0.285121 3.57511 0.215192 3.6475C0.145263 3.71989 0.0902774 3.80535 0.0533744 3.89899C0.0164714 3.99263 -0.00162641 4.09262 0.000114689 4.19326C0.00185579 4.29389 0.0234017 4.3932 0.0635218 4.48551C0.103642 4.57782 0.161551 4.66132 0.233942 4.73125L3.11394 7.61125C3.18366 7.68155 3.26662 7.73734 3.35801 7.77542C3.4494 7.8135 3.54743 7.8331 3.64644 7.8331C3.74545 7.8331 3.84348 7.8135 3.93488 7.77542C4.02627 7.73734 4.10922 7.68155 4.17894 7.61125L10.2989 1.49125C10.3751 1.42102 10.4358 1.33578 10.4774 1.2409C10.5189 1.14603 10.5404 1.04358 10.5404 0.94C10.5404 0.836423 10.5189 0.733969 10.4774 0.639095C10.4358 0.54422 10.3751 0.458981 10.2989 0.388749Z"
              fill="#4CAF50" />
          </svg>
        </template>
        <template #default>
          <strong>
            Ваш файл был успешно обработан и распознан
            {{ formatDate(tableDataFromFile.created_at) }}
          </strong>
          <br />
          Перейдите к настройке полей таблицы.
        </template>
      </Message>
      <div class="fieldStep__title text-xl my-7.5">Сопоставление полей</div>
      <Message :closable="false" severity="info" :pt="{ root: { class: ['!bg-blue-100 !border-blue-500'] } }">
        <template #messageicon>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
            <path
              d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74965 11.4489 9.74965 11.25V9C9.74965 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.293 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74965 6.89834 9.74965 6.75C9.74965 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57758 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
              fill="#3A8EFA" />
          </svg>
        </template>
        <template #default>
          Переместите колонки из верхней таблицы в соответствующие колонки шаблона,
          расположенного ниже. Желтым цветом отмечены колонки, обязательные для
          заполнения.
        </template>
      </Message>
      <div class="fieldStep__tables my-7.5">
        <div class="table__title mb-7.5 text-lg">Предпросмотр загруженного файла</div>
        <TableFromFile :data="previewShowData" class="mb-10" @onDrop="(e, index) => onDrop(e, index)" />
        <div class="table__title mb-7.5 text-lg flex justify-between" style="align-items: center">
          <p>Шаблон в системе JoyWork</p>
          <MultiSelect :pt="multiSelectStyle" id="additional_columns" v-model="selectedColumns"
            @change="additionalColumnsChanged" :options="additionalColumns" emptyFilterMessage="Ничего не найдено"
            filter optionLabel="label" optionValue="value" placeholder="Выбрано: 0" selectedItemsLabel="Выбрано: {0}"
            :maxSelectedLabels="0" class="md:w-20rem select-col" />
        </div>
        <TableEditeble :data="previewEditData" @onDrop="(e, index) => onDrop(e, index)" @onRemoveDropped="onRemove" />
      </div>
      <Message :closable="false" severity="info" :pt="{ root: { class: ['!bg-blue-100 !border-blue-500'] } }">
        <template #messageicon>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
            <path
              d="M8.99966 8.25C8.80074 8.25 8.60998 8.32902 8.46933 8.46967C8.32867 8.61032 8.24966 8.80109 8.24966 9V11.25C8.24966 11.4489 8.32867 11.6397 8.46933 11.7803C8.60998 11.921 8.80074 12 8.99966 12C9.19857 12 9.38933 11.921 9.52999 11.7803C9.67064 11.6397 9.74965 11.4489 9.74965 11.25V9C9.74965 8.80109 9.67064 8.61032 9.52999 8.46967C9.38933 8.32902 9.19857 8.25 8.99966 8.25ZM8.99966 6C8.85132 6 8.70631 6.04399 8.58298 6.1264C8.45964 6.20881 8.36351 6.32594 8.30675 6.46299C8.24998 6.60003 8.23513 6.75083 8.26407 6.89632C8.293 7.0418 8.36444 7.17544 8.46933 7.28033C8.57421 7.38522 8.70785 7.45665 8.85334 7.48559C8.99882 7.51453 9.14962 7.49968 9.28667 7.44291C9.42371 7.38614 9.54085 7.29001 9.62326 7.16668C9.70567 7.04334 9.74965 6.89834 9.74965 6.75C9.74965 6.55109 9.67064 6.36032 9.52999 6.21967C9.38933 6.07902 9.19857 6 8.99966 6ZM8.99966 1.5C8.01474 1.5 7.03947 1.69399 6.12953 2.0709C5.21959 2.44781 4.39279 3.00026 3.69635 3.6967C2.28983 5.10322 1.49966 7.01088 1.49966 9C1.4931 10.7319 2.09275 12.4114 3.19466 13.7475L1.69466 15.2475C1.59059 15.353 1.52009 15.4869 1.49206 15.6324C1.46403 15.7779 1.47972 15.9284 1.53716 16.065C1.59945 16.1999 1.70043 16.3133 1.82729 16.3908C1.95415 16.4682 2.10116 16.5063 2.24966 16.5H8.99966C10.9888 16.5 12.8964 15.7098 14.303 14.3033C15.7095 12.8968 16.4997 10.9891 16.4997 9C16.4997 7.01088 15.7095 5.10322 14.303 3.6967C12.8964 2.29018 10.9888 1.5 8.99966 1.5ZM8.99966 15H4.05716L4.75466 14.3025C4.82552 14.233 4.8819 14.1502 4.92052 14.0588C4.95914 13.9674 4.97924 13.8692 4.97966 13.77C4.97684 13.5722 4.89597 13.3835 4.75466 13.245C3.77259 12.264 3.16104 10.9729 3.02417 9.59159C2.88731 8.21029 3.23361 6.82425 4.00408 5.66964C4.77454 4.51503 5.9215 3.66327 7.24954 3.25948C8.57758 2.85569 10.0045 2.92485 11.2873 3.45519C12.5701 3.98552 13.6293 4.94421 14.2845 6.16792C14.9397 7.39163 15.1503 8.80466 14.8805 10.1663C14.6107 11.5279 13.8771 12.7538 12.8048 13.6352C11.7325 14.5166 10.3877 14.9989 8.99966 15Z"
              fill="#3A8EFA" />
          </svg>
        </template>
        <template #default>
          Смотрите пошаговые инструкции по созданию шахматки в Базе знаний. Клиентская
          поддержка: 8 800 201 89 61 (бесплатно из России).
        </template>
      </Message>
      <div class="fieldStep__btns flex flex-row gap-x-3 mt-7.5">
        <!-- <Button :disabled="isRequesting" severity="secondary" @click="$emit('update:activeItem', 0)"
          >Назад</Button
        > -->
        <Button :disabled="isRequesting" severity="success" @click="handleSendMapping">Далее</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TableEditeble from "@/entities/tableEditeble.vue";
import TableFromFile from "@/entities/tableFromFile.vue";
import { formatDate } from "@/shared/utils/util";
import { toRefs, watch } from "vue";
import { onBeforeMount, onMounted, ref } from "vue";

const emits = defineEmits(["update:activeItem", "updateImport"]);

const props = defineProps({
  isRequesting: Boolean,
  data: Object,
});

const { data: tableDataFromFile } = toRefs(props);

const selectedColumns = ref();
const additionalColumns = ref([
  { label: "Код планировки", value: "layout_code" },
  { label: "Описание", value: "description" },
  { label: "Название ЖК", value: "complex_name" },
  { label: "Номер на площадке", value: "on_site_number" },
  { label: "Жилая площадь, м2", value: "living_area" },
  { label: "Площадь кухни, м2", value: "kitchen_area" },
  { label: "Расчетная площадь, м2", value: "estimated_area" },
  { label: "Куда выходят окна", value: "windows_placement_id" }, // get id from DB using passed name
  { label: "Высота потолков", value: "ceiling_height" },
  { label: "Кол-во лоджий", value: "loggias_count" },
  { label: "Кол-во балконов", value: "balconies_count" },
  { label: "Кол-во совмещенных санузлов", value: "combined_bathrooms_count" },
  { label: "Кол-во раздельных санузлов", value: "seperated_bathrooms_count" },
  { label: "Студия", value: "layout_feature.studio" },
  { label: "Свободная планировка", value: "layout_feature.available" },
  { label: "Европланировка", value: "layout_feature.european_layout" },
  { label: "Отделка", value: "decoration_id" }, // get id from DB using passed name
  { label: "Номер помещения для БТИ", value: "bti_room_number" },
  { label: "Общая площадь по БТИ", value: "bti_total_area" },
  { label: "Площадь без балкона", value: "area_without_balcony" },
  { label: "Площадь прихожей, м2", value: "hallway_area" },
]);

const previewShowData = ref({});
const previewEditData = ref({
  body: [
    {
      items: [],
      initialIndex: 0,
    },
  ],
  head: [
    { label: "Номер Помещения", value: "number" },
    { label: "Полная стоимость", value: "total_amount" },
    { label: "Подъезд", value: "entrance_id" },
    { label: "Этаж", value: "floor_id" },
    { label: "Общая площадь м2", value: "area" },
    { label: "Статус помещения", value: "complex_status_id" },
    { label: "Тип помещения", value: "type" },
    { label: "Кол-во комнат", value: "rooms_count" },
    { label: "Дом", value: "house_name" },
  ],
});

const additionalColumnsChanged = (e) => {
  const clickedLabel = e.originalEvent.target.closest("li")?.getAttribute("aria-label");

  if (!clickedLabel) {
    const checkBox = e.originalEvent.target.closest('.p-checkbox-box')

    if (checkBox) {
      const isRemoved = checkBox.classList.contains('p-highlight');

      if (!isRemoved) {
        previewEditData.value.head = [
          ...previewEditData.value.head.filter((item) => !additionalColumns.value.find(column => column.value == item.value)),
          ...additionalColumns.value
        ]
        previewEditData.value.body = [
          ...previewEditData.value.body.filter((item) => !item.additionalLabel),
          ...additionalColumns.value.map((column, index) => ({
            initialIndex: previewEditData.value.body.length + index,
            items: new Array(10).fill(null),
            additionalLabel: column.label
          }))
        ]
      } else {
        previewEditData.value.head = previewEditData.value.head.filter((item) => !additionalColumns.value.find(column => column.value == item.value))
        previewEditData.value.body = previewEditData.value.body.filter((item) => !item.additionalLabel)

      }
    }

  } else {
    const option = additionalColumns.value.find((column) => column.label == clickedLabel);

    const isRemoved = !e.value.includes(option.value);

    if (!isRemoved) {
      previewEditData.value.head.push(option);
      previewEditData.value.body.push({
        initialIndex: previewEditData.value.body.length,
        items: new Array(10).fill(null),
        additionalLabel: clickedLabel,
      });
    } else {
      const bodyItem = previewEditData.value.body.find(
        (item) => item.additionalLabel == clickedLabel
      );
      previewShowData.value.body[bodyItem.initialIndex] = bodyItem;

      previewEditData.value.body = previewEditData.value.body.filter(
        (item) => item.additionalLabel != clickedLabel
      );
      previewEditData.value.head = previewEditData.value.head.filter(
        (item) => item.label != clickedLabel
      );
    }
  }

};
const onDrop = (event, index) => {
  event.preventDefault();

  if (event.dataTransfer) {
    const sourceIndex = parseInt(event.dataTransfer.getData("col_id"));
    if (!previewEditData.value.body[index])
      previewEditData.value.body[index] = { items: [] };
    if (!previewEditData.value.body[index].items[0]) {
      previewEditData.value.body[index].items =
        previewShowData.value.body[sourceIndex].items;
      previewEditData.value.body[index].initialIndex =
        previewShowData.value.body[sourceIndex].initialIndex;

      previewShowData.value.body[sourceIndex].items = new Array(10).fill(null);
    }
  }
};

onBeforeMount(() => {
  if (tableDataFromFile.value.body.length) {
    previewEditData.value.body = tableDataFromFile.value.body.slice(0, 9).map((
      tableData,
      index //
    ) => ({
      initialIndex: tableData.initialIndex,
      items: index < 5 ? tableData.items : new Array(10).fill(null),
    }));

    if (previewEditData.value.body.length < previewEditData.value.head.length) {
      let num = previewEditData.value.body.length;
      while (num < previewEditData.value.head.length) {
        previewEditData.value.body.push({
          items: new Array(10).fill(null),
          initialIndex: 0,
        });
        num++;
      }
    }

    if (previewEditData.value.body.length < previewEditData.value.head.length) {
    }
    previewShowData.value.body = tableDataFromFile.value.body.map((tableData, index) => ({
      initialIndex: tableData.initialIndex,
      items: index < 5 ? new Array(10).fill(null) : tableData.items,
    }));
    previewShowData.value.head = tableDataFromFile.value.head;

    if (previewEditData.value.head.length > previewEditData.value.body.length) {
      previewEditData.value.head.slice(previewEditData.value.body.length - 1);
    }
  }
});

const onRemove = (e, index, colInfo) => {
  previewShowData.value.body[colInfo.initialIndex].items = colInfo.items;
  previewEditData.value.body[index].items = new Array(10).fill(null);
};

const handleSendMapping = () => {
  const map = {};

  previewEditData.value.head.forEach((headItem, index) => {
    if (previewEditData.value.body[index]?.items[0]) {
      map[headItem.value] = previewEditData.value.body[index]?.items[0];
    }
  });

  emits("updateImport", { mapping_fields: JSON.stringify(map), step: 3 });
};
</script>

<style scoped lang="scss">
.draggable-table,
.tableWithData {
  width: 100%;
  border-collapse: collapse;
}

.select-col {
  width: 300px;
}

.loadingScreen {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &__content {
    width: 100%;
    height: auto;
    border-radius: 3px;
    border: 1px solid #dedede;
    background: var(--linear, linear-gradient(180deg, #fefefe 0%, #f6f6f6 100%));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    margin-bottom: 30px;
  }

  &__title {
    font-size: 21px;
    font-weight: 500;
    margin-bottom: 14px;
  }

  &__text {
    font-size: 12px;
    text-align: center;
    @apply text-grey-900;
  }
}
</style>
