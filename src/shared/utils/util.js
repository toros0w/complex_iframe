

export function isEmpty(data) {
    if (typeof data === "object") {
        if (JSON.stringify(data) === "{}" || JSON.stringify(data) === "[]") {
            return true;
        } else if (!data) {
            return true;
        }
        return false;
    } else if (typeof data === "string") {
        if (!data.trim()) {
            return true;
        }
        return false;
    } else if (typeof data === "undefined") {
        return true;
    } else {
        return false;
    }
}

export const layout_futures = {
    none_of_the_above:  "Ничего из перечисленного",
    studio:  "Студия",
    european_layout:  "Европланировка",
    available:  "Свободная",
}

export const room_types = {
    apartment: 'Квартира',
    apartments: 'Апартаменты',
    parking_space: 'Машиноместо',
    office: 'Офис',
    storage_room: 'Кладовка',
    warehouse: 'Склад',
    retail_space: 'Торговое Помещение',
    commercial_space: 'Помещение свободного назначения',
    townhouse: 'Таунхаус',
    villa: 'Вилла',
    penthouse: 'Пентхаус',
    duplex: 'Дуплекс',
    cottage: 'Коттедж',
};

export const room_types_which_has_rooms = [ 
  'apartment',
  'apartments',
  'retail_space',
  'commercial_space',
  'townhouse',
  'villa',
  'penthouse',
  'duplex',
  'cottage'
]

export const fixRoomVisible = (room, filters) => {
    room.visible = true
    const isMoreThenFive = filters.rooms.includes('5-more')
    const isSelectedStudio = filters.rooms.includes('studio')
    const isRoomCountSelected = filters.rooms.includes(String(room.rooms_count));


    if (filters.rooms.length) {
      if (filters.selectedTypes.some((type) => room_types_which_has_rooms.includes(type))) {
        if (isSelectedStudio) {
          room.visible = room.layout_feature == 'studio' || (
            isRoomCountSelected && room.layout_feature != 'studio' || (isMoreThenFive && room.rooms_count >= 5)
          )
        } else {
          room.visible = (isRoomCountSelected && room.layout_feature != 'studio' || (isMoreThenFive && room.rooms_count >= 5))
        }
      }
    }
  
    if (filters.onlyFree && room.status_type !== 'available') {
      room.visible = false
    }
  
    if (filters.price.min !== '') {
      if (!filters.useSquarePrice) {
        if (filters.price.min > room.total_amount) {
          room.visible = false
        }
      } else {
        if (filters.price.min > room.total_amount / room.area) {
          room.visible = false
        }
      }
    }
  
    if (filters.price.max !== '' ) {
      if (!filters.useSquarePrice) {
        if (filters.price.max < room.total_amount) {
          room.visible = false
        }
      } else {
        if (filters.price.max < room.total_amount / room.area) {
          room.visible = false
        }
      }
    }
  
    if (filters.square.min !== '' && filters.square.min > room.area ) {
      room.visible = false
    }
  
    if (filters.square.max !== '' && filters.square.max < room.area ) {
      room.visible = false
    }

    if (filters.squareKitchen.max !== '' && (!room.kitchen_area ? true : filters.squareKitchen.max < +room.kitchen_area) ) {
      room.visible = false
    }

    if (filters.squareKitchen.min !== '' && (!room.kitchen_area ? true : filters.squareKitchen.min > +room.kitchen_area) ) {
      room.visible = false
    }

    if (filters.selectedTypes.length && !filters.selectedTypes.includes(room.type)) {
      room.visible = false 
    }

    if (filters.floor.from !== '' && room.floor && parseInt(filters.floor.from) > room.floor ) {
        room.visible = false
    }
    if (filters.floor.to !== '' && room.floor && parseInt(filters.floor.to) < room.floor ) {
      room.visible = false
    }
  
    if (filters.selectedDecorations && filters.selectedDecorations.length && !filters.selectedDecorations.map(num => parseInt(num) ).includes(room.decoration_id)) {
      room.visible = false 
    }

    if (filters.selectedWindowsPlacements && filters.selectedWindowsPlacements.length && !filters.selectedWindowsPlacements.map(num => parseInt(num) ).includes(room.windows_placement_id)) {
      room.visible = false 
    }

    if (filters.number && room.number != filters.number) {
      room.visible = false 
    }
    //если выбрана просто площадка
    if (filters.adsTargets && filters.adsTargets.length && (!filters.adsStates || !filters.adsStates.length)) {
        //если у нас выбран домклик
        if (filters.adsTargets.map(num => parseInt(num) ).includes(4) && !room.add_to_domclick_feed) {
            room.visible = false;
        }
        //если у нас выбран авито
        if (filters.adsTargets.map(num => parseInt(num) ).includes(1) && !room.add_to_avito_feed) {
            room.visible = false;
        }
        //если у нас выбран циан
        if (filters.adsTargets.map(num => parseInt(num) ).includes(2) && !room.add_to_cian_feed) {
            room.visible = false;
        }
    }
    //если выбран просто статус
    if (filters.adsStates && filters.adsStates.length && (!filters.adsTargets || !filters.adsTargets.length)) {
        onlyStateCheck(room, filters);
    }
    //если выбрана и площадка и статус
    if (filters.adsTargets && filters.adsTargets.length && filters.adsStates && filters.adsStates.length) {
        //если у нас выбран домклик
        if (filters.adsTargets.map(num => parseInt(num) ).includes(4)) {
            domclickStateCheck(room, filters);
        }
        //если у нас выбран авито
        if (filters.adsTargets.map(num => parseInt(num) ).includes(1)) {
            avitoStateCheck(room, filters);
        }
        //если у нас выбран циан
        if (filters.adsTargets.map(num => parseInt(num) ).includes(2)) {
            cianStateCheck(room, filters);
        }
    }
  }

  export const stateError = (room) => {
    return (room.add_to_domclick_feed && room.ads_domclick_error) ||
        (room.add_to_avito_feed && room.ads_avito_error) || (room.add_to_cian_feed && room.ads_cian_error);
  }

  export const stateWait = (room) => {
      return (room.add_to_domclick_feed && !room.ads_domclick_error && !room.ads_domclick_url) ||
          (room.add_to_avito_feed && !room.ads_avito_error && !room.ads_avito_url) ||
          (room.add_to_cian_feed && !room.ads_cian_error && !room.ads_cian_url);
  }

  export const onlyStateCheck = (room, filters) => {
      //делаем наоборот, считаем, что изначально не видно
      let visible = false;

      //если не размещается
      if (filters.adsStates.map(num => parseInt(num) ).includes(1) &&
          !room.add_to_domclick_feed && !room.add_to_avito_feed && !room.add_to_cian_feed) {
          visible = true;
      }
      //если отправлен
      if (filters.adsStates.map(num => parseInt(num) ).includes(2) && stateWait(room)) {
          visible = true;
      }
      //если с ошибками
      if (filters.adsStates.map(num => parseInt(num) ).includes(3) &&
          (room.ads_domclick_error || room.ads_avito_error || room.ads_cian_error)) {
          visible = true;
      }
      //если размещается
      if (filters.adsStates.map(num => parseInt(num) ).includes(4) &&
          !stateWait(room) && !stateError(room) &&
          ((room.add_to_domclick_feed && room.ads_domclick_url) || (room.add_to_avito_feed && room.ads_avito_url)
              || (room.add_to_cian_feed && room.ads_cian_url))) {
          visible = true;
      }

      if (!visible) {
          room.visible = false;
      }
  }

  export const domclickStateCheck = (room, filters) => {
    //делаем наоборот, считаем, что изначально не видно
    let visible = false;

    //если не размещается
    if (filters.adsStates.map(num => parseInt(num) ).includes(1) && !room.add_to_domclick_feed) {
        visible = true;
    }
    //если отправлен
    if (filters.adsStates.map(num => parseInt(num) ).includes(2) && room.add_to_domclick_feed && !room.ads_domclick_error && !room.ads_domclick_url) {
        visible = true;
    }
    //если с ошибками
    if (filters.adsStates.map(num => parseInt(num) ).includes(3) && room.ads_domclick_error) {
        visible = true;
    }
    //если размещается
    if (filters.adsStates.map(num => parseInt(num) ).includes(4) && room.add_to_domclick_feed && room.ads_domclick_url) {
        visible = true;
    }

    if (!visible) {
        room.visible = false;
    }
  }

  export const avitoStateCheck = (room, filters) => {
    //делаем наоборот, считаем, что изначально не видно
    let visible = false;

    //если не размещается
    if (filters.adsStates.map(num => parseInt(num) ).includes(1) && !room.add_to_avito_feed) {
        visible = true;
    }
    //если отправлен
    if (filters.adsStates.map(num => parseInt(num) ).includes(2) && room.add_to_avito_feed && !room.ads_avito_error && !room.ads_avito_url) {
        visible = true;
    }
    //если с ошибками
    if (filters.adsStates.map(num => parseInt(num) ).includes(3) && room.ads_avito_error) {
        visible = true;
    }
    //если размещается
    if (filters.adsStates.map(num => parseInt(num) ).includes(4) && room.add_to_avito_feed && room.ads_avito_url) {
        visible = true;
    }

    if (!visible) {
        room.visible = false;
    }
  }

export const cianStateCheck = (room, filters) => {
    //делаем наоборот, считаем, что изначально не видно
    let visible = false;

    //если не размещается
    if (filters.adsStates.map(num => parseInt(num) ).includes(1) && !room.add_to_cian_feed) {
        visible = true;
    }
    //если отправлен
    if (filters.adsStates.map(num => parseInt(num) ).includes(2) && room.add_to_cian_feed && !room.ads_cian_error && !room.ads_cian_url) {
        visible = true;
    }
    //если с ошибками
    if (filters.adsStates.map(num => parseInt(num) ).includes(3) && room.ads_cian_error) {
        visible = true;
    }
    //если размещается
    if (filters.adsStates.map(num => parseInt(num) ).includes(4) && room.add_to_cian_feed && room.ads_cian_url) {
        visible = true;
    }

    if (!visible) {
        room.visible = false;
    }
}

  export const typeRooms = [
    {
      name: "Студия",
      value: "studio",
    },
    {
      name: "1",
      value: "1",
    },
    {
      name: "2",
      value: "2",
    },
    {
      name: "3",
      value: "3",
    },
    {
      name: "4",
      value: "4",
    },
    {
      name: "5 и более",
      value: "5-more",
    },
  ];

export const adsTargets = [
    {
        name: "Авито",
        value: "1",
    },
    {
        name: "Циан",
        value: "2",
    },
    {
        name: "Домклик",
        value: "4",
    }
];

export const adsStates = [
    {
        name: "Не размещается",
        value: "1",
    },
    {
        name: "Отправлен",
        value: "2",
    },
    {
        name: "С ошибками",
        value: "3",
    },
    {
        name: "Размещается",
        value: "4",
    }
];

  export const containsNumber = (str) => {
    let regex = /\d/;

    return regex.test(str);
  }

  export const isErrorStatus = (apartament) => {
      return apartament.ads_domclick_error || apartament.ads_avito_error || apartament.ads_cian_error;
  }

  export const isWaitStatus = (apartament) => {
      let waitSt = false;

      if (apartament.add_to_domclick_feed && !apartament.ads_domclick_error && !apartament.ads_domclick_url) {
          waitSt = true;
      }

      if (apartament.add_to_avito_feed && !apartament.ads_avito_error && !apartament.ads_avito_url) {
          waitSt = true;
      }

      if (apartament.add_to_cian_feed && !apartament.ads_cian_error && !apartament.ads_cian_url) {
          waitSt = true;
      }

      return waitSt;
  }

  export const isSendToAds = (apartament) => {
      return apartament.add_to_cian_feed || apartament.add_to_avito_feed || apartament.add_to_domclick_feed || apartament.add_to_yandex_feed;
  }

  export const isActiveStatus = (apartament) => {
      let activeSt = false;

      if (!isWaitStatus(apartament) && !isErrorStatus(apartament)) {
          if (apartament.add_to_domclick_feed && !apartament.ads_domclick_error && apartament.ads_domclick_url) {
              activeSt = true;
          }

          if (apartament.add_to_avito_feed && !apartament.ads_avito_error && apartament.ads_avito_url) {
              activeSt = true;
          }

          if (apartament.add_to_cian_feed && !apartament.ads_cian_error && apartament.ads_cian_url) {
              activeSt = true;
          }
      }

      return activeSt;
    }

  export const getStatusText = (apartament) => {
      let statusText = "";

      if (apartament.ads_domclick_error) {
          statusText = statusText + `<div>Домклик - ошибка размещения</div><h4 style='font-weight: bold;'>Ошибки размещения</h4><div style='font-size: 12px;'>` + apartament.ads_domclick_error + `</div>`;
      }

      if (apartament.ads_avito_error) {
          statusText = statusText + `<div>Авито - ошибка размещения</div><h4 style='font-weight: bold;'>Ошибки размещения</h4><div style='font-size: 12px;'>` + apartament.ads_avito_error + `</div>`;
      }

      if (apartament.ads_cian_error) {
          statusText = statusText + `<div>Циан - ошибка размещения</div><h4 style='font-weight: bold;'>Ошибки размещения</h4><div style='font-size: 12px;'>` + apartament.ads_cian_error + `</div>`;
      }

      if (apartament.add_to_domclick_feed && !apartament.ads_domclick_error && !apartament.ads_domclick_url) {
          statusText = statusText + `<div>Домклик - отправлен</div>`;
      }

      if (apartament.add_to_avito_feed && !apartament.ads_avito_error && !apartament.ads_avito_url) {
          statusText = statusText + `<div>Авито - отправлен</div>`;
      }

      if (apartament.add_to_cian_feed && !apartament.ads_cian_error && !apartament.ads_cian_url) {
          statusText = statusText + `<div>Циан - отправлен</div>`;
      }

      if (apartament.add_to_domclick_feed && !apartament.ads_domclick_error && apartament.ads_domclick_url) {
          statusText = statusText + `<div style='pointer-events: initial;'><a style='border-bottom: 1px solid;' href='` + apartament.ads_domclick_url + `' target='_blank'>Домклик</a> - размещено</div>`;
      }

      if (apartament.add_to_avito_feed && !apartament.ads_avito_error && apartament.ads_avito_url) {
          statusText = statusText + `<div style='pointer-events: initial;'><a style='border-bottom: 1px solid;' href='` + apartament.ads_avito_url + `' target='_blank'>Авито</a> - размещено</div>`;
      }

      if (apartament.add_to_cian_feed && !apartament.ads_cian_error && apartament.ads_cian_url) {
          statusText = statusText + `<div style='pointer-events: initial;'><a style='border-bottom: 1px solid;' href='` + apartament.ads_cian_url + `' target='_blank'>Циан</a> - размещено</div>`;
      }

      return statusText;
  }


  export const formatNumber = (number) => {
    if (!number) return 0;

    let numberStr = number.toString();
    
    let parts = numberStr.split('.');
    
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    let formattedNumber = parts.length === 2 ? integerPart + '.' + parts[1] : integerPart;
    
    return formattedNumber;
  }

  export const join = (arr /*, separator */) => {
    var separator = arguments.length > 1 ? arguments[1] : ", ";
    return arr.filter(function(n){
        return n
    }).join(separator);
  }

export const getConstraints = (kladr, label) => {
    let ids = new Array();
    if (kladr == 0 && label == 'москва и московская область') {
        ids.push({ kladr_id: "7700000000000" });
        ids.push({ kladr_id: "5000000000000" });
    } else if (kladr == 0 && label == 'санкт-петербург и ленинградская обл') {
        ids.push({ kladr_id: "7800000000000" });
        ids.push({ kladr_id: "4700000000000" });
    } else if (kladr == 0 && label == 'крым и севастополь') {
        ids.push({ kladr_id: "9100000000000" });
        ids.push({ kladr_id: "9200000000000" });
    } else {
        ids.push({ kladr_id: kladr.toString() });
    }

    return ids;
}

export const INITIAL_COMPLEX = {
  id: 0,
  type: 'complex',
  name: '',
  address: {
    "id": null,
    "complex_id": null,
    "address": "",
    // "rayon_id": null,
    "rayon": null,
    "city": "",
    "street": "",
    "korpus": "",
    "dom": "",
    "litera": "",
    "kladr_id": "",
    "latitude": "",
    "longitude": ""
  },
  actions: [],
  address_line: '',
  rf_region_id: 0,
  country_id: 171,
  rf_region_rayon: '',
  // rayon_id: 0,
  city: '',
  street: '',
  korpus: '',
  dom: '',
  litera: '',
  kladr_id: '',
  region_kladr_id: '',
  latitude: '',
  longitude: '',
  lines: [],
  deadline: [],
  builder_id: null,
  images: [],
  payment_types: [],
  contract_type: '',
  housing_class_id: null,
  first_floor: '',
  last_floor: '',
  number_apartments: '',
  ceiling_height: '',
  decoration_id: null,
  parking: 0,
  closed_area: 0,
  protected_area: 0,
  concierge: 0,
  house_type: null,
  house_material: null,
  metros: [],
  infrastructure: {
      'school': 0,
      'kindergarten': 0,
      'playgrounds': 0,
      'sportsgrounds': 0,
      'cafes': 0,
      'shops': 0,
      'beautysalons': 0,
      'fitnessclub': 0,
      'park': 0,
      'trc': 0,
      'commercialobjects': 0,
  },
  metro: {
      'metro_id': null,
      'subway_time': '',
      'subway_distance': null,
  },
  dop: {
      domclick_id: null,
      title_desc: '',
      text_desc: '',
      title_desc_dop: '',
      text_desc_dop: '',
      url_video: '',
      type_video: null,
      UTP: [],
      UTP2: [],
      phone_op: '',
      phone_mobil_op: null,
      address_op: '',
      latitude_op: '',
      longitude_op: '',
      timezone_op: '',
      workdays_op: null,
      opentime_op: '',
      closetime_op: ''
  },
  actions: [],
  cadastral_number: null,
  has_show_room: false
}

export const confirmpopupStyle = {
  root: {
    class: ["!p-3.5"],
  },
  content: {
    class: ["!p-0 !mb-2.5"],
  },
  message: {
    class: ["!m-0 !text-base !font-normal"],
  },
  footer: {
    class: ["!flex !flex-row-reverse !justify-center !gap-x-3 !p-0"],
  },
  rejectButton: {
    class: ["!px-3 !font-normal !m-0"],
  },
  acceptButton: {
    class: ["!px-3 !font-normal"],
  },
};

export const photoToObjectUrl = (url) => URL.createObjectURL(url)

export const copyObject = (object) => JSON.parse(JSON.stringify(object))

export const generateAlphabetSequence = (number) => {
  let result = [];

  function numberToAlphabet(n) {
    let chars = [];
    while (n > 0) {
      let remainder = (n - 1) % 26;
      chars.push(String.fromCharCode(remainder + 65));
      n = Math.floor((n - 1) / 26);
    }
    return chars.reverse().join('');
  }

  for (let i = 1; i <= number; i++) {
    result.push(numberToAlphabet(i));
  }

  return result;
}

export const multiSelectStyle = {
  root: {
    class: [
      '!rounded !border !border-grey-400 !p-3 !h-max',
    ],
  },
  input: {
    class: [
      '!flex !flex-row !items-center !p-0 !text-sm !leading-none !text-grey-900 !mr-3',
    ],
  },
  wrapper: {
    class: ['!p-0'],
  },
  item: {
    class: ['!text-sm'],
  },
  label: {
    class: ['!p-0']
  },
  header: {
    class: ['custom-header']
  }
};


export const formatDate = (utcDateStr) => {
  const [datePart, timePart] = utcDateStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  
  const options = {
    timeZone: 'Asia/Yerevan',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24-hour format
  };
  
  const formatter = new Intl.DateTimeFormat('en-US', options);
  
  const timeZonedDate = formatter.format(utcDate);
  
  return timeZonedDate
}