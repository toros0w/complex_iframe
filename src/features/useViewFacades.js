import Map from "ol/Map";
import View from "ol/View";
import ImageLayer from "ol/layer/Image";
import Projection from "ol/proj/Projection";
import { defaults as InteractionDefault } from "ol/interaction/defaults";
import { defaults as ControlDefault } from "ol/control/defaults";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Collection from "ol/Collection";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Overlay from "ol/Overlay";
import OlSelect from "ol/interaction/Select";
import OlModify from "ol/interaction/Modify";
import Feature from "ol/Feature";
import { Polygon } from "ol/geom";
import {
  Area,
  MyFeature,
  TModify,
  TOlMap,
  TSelect,
} from "@/app/types/facadeViewCanvas";
import { ref, watch } from "vue";
//import { Coordinate } from "ol/coordinate";

/*export type Facade = {
  id: string;
  image: string;
  figures: Area[];
};*/

export default function useViewFacades() {
  const mapObj = ref(null);
  const activeFacade = ref(0);
  const currentFacade = ref(null);
  const facades = ref(null)
  const optionsFloor = ref({
    floor: null,
    entrance: null,
    rooms: [],
    id: null,
  })
  const openedFigure = ref({
    floor: null,
    entrance: null,
    rooms: [],
    id: null,
  })
  const openModal = ref(false);
  const existingOverlays = ref(null);

  const opacity = ref();

  const emptyHoverStyle = ref()
  const hoverStyle = ref();

  watch(currentFacade, () => {
    opacity.value = currentFacade.value.opacity === 1 ? 0.99 : currentFacade.value.opacity
    hoverStyle.value = new Style({
      fill: new Fill({
        color: mapObj.value.hexToRgba(currentFacade.value.hover_color, 1 - opacity.value),
      }),
      stroke: new Stroke({
        color: mapObj.value.hexToRgba(currentFacade.value.hover_color),
        width: 2,
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: mapObj.value.hexToRgba(currentFacade.value.hover_color),
        }),
      }),
    });
  })

  watch(mapObj, (mapObjValue) => {
    emptyHoverStyle.value = new Style({
      fill: new Fill({
        color: mapObjValue.hexToRgba('#adadad', 0.8),
      }),
      stroke: new Stroke({
        color: mapObjValue.hexToRgba('#adadad'),
        width: 2,
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: mapObjValue.hexToRgba('#adadad'),
        }),
      }),
    })
  })

  function start(facadesList) {
    if (facadesList) facades.value = facadesList

    currentFacade.value = facades.value[activeFacade.value];
    mapObj.value = new OlMap(currentFacade.value.image, "map", function (
      olMap
    ) {
      onMapLoad(olMap);
    });
    window.addEventListener("resize", () => {
      if (mapObj.value) {
        mapObj.value.resize();
      }
    });
  }

  function OlMap(imageUrl, target, onMapLoad) {
    this.target = target;
    this.imageElement = new Image();

    this.imageElement.onload = () => {
      this.onImageLoad();
      onMapLoad(this);
    };

    this.imageElement.src = imageUrl;
  }

  OlMap.prototype.onImageLoad = function () {
    this.createMap(this.imageElement, this.target);
  };

  OlMap.prototype.createMap = function (
    imageElement,
    target
  ) {
    this.imageLayer = this.createImageLayer(imageElement);

    const targetElement = document.getElementById(target);
    const view = this.createView(imageElement, targetElement);

    this.vector = this.createVector();

    this.map = new Map({
      layers: [this.imageLayer, this.vector],
      overlays: [],
      controls: ControlDefault({
        zoom: false,
        rotate: false,
      }),
      target: "map",
      view: view,
      pixelRatio: 1,
      interactions: InteractionDefault({
        mouseWheelZoom: false,
        dragPan: false,
      }),
    });

    this.addInteractionsToMap(this.map, this.vector);
    this.addEvents();

    const containerHeight = targetElement.clientHeight;
    const imageWidth = imageElement.width;
    const imageHeight = imageElement.height;
    const mapWidth = (containerHeight / imageHeight) * imageWidth;
    this.map.setSize([mapWidth, containerHeight]);
    if (existingOverlays.value) {
      mapObj.value.map.addOverlay(existingOverlays.value);
      this.overlay = existingOverlays.value;
    } else {
      this.overlay = this.createOverlay(document.getElementById("popup"));
      mapObj.value.map.addOverlay(this.overlay);
      mapObj.value.overlay.setPosition(undefined)
    }
  };

  OlMap.prototype.createImageLayer = function (
    imageElement
  ) {
    const imageStatic = this.createImageStatic(imageElement);

    return new ImageLayer({
      source: imageStatic,
    });
  };
  OlMap.prototype.createImageStatic = function (
    imageElement
  ) {
    return new Static({
      url: imageElement.src,
      imageExtent: [0, 0, imageElement.width, imageElement.height],
    });
  };
  OlMap.prototype.createView = function (
    imageElement,
    targetElement
  ) {
    const projection = this.createProjection(imageElement);
    const containerHeight = document.getElementById("map").clientHeight;
    const imageResolution = imageElement.naturalHeight / containerHeight;

    return new View({
      resolution: imageResolution,
      projection: projection,
      center: getCenter([0, 0, imageElement.width, imageElement.height]),
      zoom: 0,
    });
  };

  OlMap.prototype.createProjection = function (
    imageElement
  ) {
    return new Projection({
      code: "olimage",
      units: "pixels",
      extent: [0, 0, imageElement.width, imageElement.height],
    });
  };

  OlMap.prototype.createVector = function () {
    this.sourceVector = this.createSourceVector();

    const style = this.createStyle();

    return new VectorLayer({
      source: this.sourceVector,
      style: style,
    });
  };

  OlMap.prototype.createSourceVector = function () {
    this.features = new Collection();

    return new VectorSource({
      features: this.features,
    });
  };

  OlMap.prototype.createStyle = function () {
    return new Style({
      fill: new Fill({
        color: this.hexToRgba(currentFacade.value.hover_color, 0.2),
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: this.hexToRgba(currentFacade.value.hover_color),
        }),
      })
    })
  };

  OlMap.prototype.createOverlay = function (
    container
  ){
    return new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 0,
        },
      },
    });
  };

  OlMap.prototype.addInteractionsToMap = function (
    map,
    vector
  ) {
    this.modify = new Modify(map);
    this.modify.setActive(true);
  };

  OlMap.prototype.addEvents = function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const mapObj = this;
    this.map.on("click", function (event) {
      let currentFeature;
      this.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          if (feature.getGeometry().getType() == "Polygon") {
            currentFeature = feature;
          }
        }
      );
      if (currentFeature) {
        if (openModal.value) openModal.value = false;

        if (openedFigure.value.id) {
          closeOverlay()

          openedFigure.value = {
            floor: null,
            entrance: null,
            rooms: [],
            id: null,
          }
        } else {
          openedFigure.value = {
            floor: currentFeature.get("floor"),
            entrance: currentFeature.get("entrance"),
            rooms: currentFeature.get("rooms"),
            id: currentFeature.getId()
          };

          showOverLay(currentFeature)
        }
      } else {
        closeOverlay()

        openedFigure.value = {
          floor: null,
          entrance: null,
          rooms: [],
          id: null,
        }
        openModal.value = false
      }
    });

    this.map.on("pointermove", function (event) {
      if (openedFigure.value.id) return;
      let currentFeature;
      this.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          if (feature.getGeometry().getType() == "Polygon") {
            currentFeature = feature;
          }
        }
      );

      if (
        currentFeature &&
        mapObj.features.getArray().indexOf(currentFeature) > -1
      ) {
        optionsFloor.value = {
          floor: currentFeature.get("floor"),
          entrance: currentFeature.get("entrance"),
          rooms: currentFeature.get("rooms"),
          id: currentFeature.getId()
        };
        mapObj.hovered = true;
        currentFeature.setStyle(currentFeature.get("rooms").filter((room) => room.visible).length ? hoverStyle.value : emptyHoverStyle.value);
        mapObj.removeStyleFromFeatures(currentFeature, mapObj);
      } else if (mapObj.hovered) {
        mapObj.hovered = false;
        mapObj.removeStyleFromFeatures(null, mapObj);
      }
    });
  };

  OlMap.prototype.hexToRgba = function (
    hex,
    opacity
  ) {
    if (!hex) return;
    hex = hex.replace("#", "");

    const color = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };

    if (opacity) {
      opacity = opacity > 1 ? opacity / 100 : opacity;
      return (
        "rgba(" +
        color.r +
        ", " +
        color.g +
        ", " +
        color.b +
        ", " +
        opacity +
        ")"
      );
    } else {
      return "rgba(" + color.r + ", " + color.g + ", " + color.b + ")";
    }
  };

  OlMap.prototype.removeStyleFromFeatures = function (
    currentFeature,
    mapObj
  ) {
    this.sourceVector?.getFeatures().forEach(function (feature) {
      if (currentFeature) {
        if (feature.getId() !== currentFeature.getId()) {
          feature.setStyle(mapObj.createStyle());
        }
      } else {
        feature.setStyle(mapObj.createStyle());
      }
    });
  };

  OlMap.prototype.resize = function () {
    if (this.map) {
      const image = this.imageElement;
      const container = document.getElementById("map");

      if (container) {
        const containerHeight = container.clientHeight;
        const imageResolution = image.naturalHeight / containerHeight;
        this.map.getView().setResolution(imageResolution);
      }
    }
  };

  OlMap.prototype.setColor = function (
    color,
    opacity
  ) {
    this.color = color;
    this.opacity = opacity || 20;

    const style = this.vector.getStyle();
    style.getFill().setColor(this.hexToRgba(this.color, this.opacity));
  };

  /* Interactions */

  function Modify(map) {
    this.interaction = new OlModify({
      features: mapObj.value ? mapObj.value.features : new Collection(),
      // deleteCondition: function (event) {
      //   return shiftKeyOnly(event) && singleClick(event);
      // },
    });

    //   map.addInteraction(this.interaction);
  }

  Modify.prototype.setActive = function (active) {
    //   this.interaction.setActive(active);
  };

  function Select(map) {
    this.interaction = new OlSelect();
    map.addInteraction(this.interaction);
  }

  Select.prototype.setActive = function (active) {
    this.interaction.setActive(active);
  };

  Select.prototype.clear = function () {
    const selectedFeatures = this.interaction.getFeatures();

    // selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
  };

  function onMapLoad(mapObj) {
    initFeatures();

    addMapEvents(mapObj);

    colorInit();
  }

  function changeFeatureRooms(id, rooms) {
    mapObj.value.features.forEach((feature) => {
      if (feature.getId() == id) {
        feature.set('rooms', rooms)
      }
    })
  }

  function initFeatures() {
    const figures = currentFacade.value.figures;
    figures.forEach(function (item) {
      const polygon = new Polygon([item.points]);
      const feature = new Feature({
        geometry: polygon,
      });

      feature.setStyle(mapObj.value.createStyle());
      
      feature.setId(item.id);
      feature.set("entrance", item.entrance);
      feature.set("floor", item.floor);
      feature.set('rooms', item.rooms)

      try {
        mapObj.value.sourceVector.addFeature(feature);
      } catch (e) {
        location.reload();
      }
    });
  }

  function addMapEvents(mapObj) {
    if (!mapObj.value) return;
    mapObj.value.map
      .getViewport()
      .addEventListener("mousemove", function (event) {
        event.preventDefault();
      });
    mapObj.value.map.getViewport().addEventListener("click", function (event) {
      event.preventDefault();
    });
  }

  function showOverLay(feature) {
    const popup = document.querySelector("#popup");

    if (popup.style.left != 'unset') {
      popup.style.left = 'unset'
    }
    // mapObj.value.select.interaction.getFeatures().push(feature);
    // mapObj.value.selectFeature = feature;

    const coordinates = feature.getGeometry().getCoordinates()[0];
    let currentCoordinate = coordinates[0];

    coordinates.forEach(function (coord) {
      if (coord[0] > currentCoordinate[0] && coord[1] > currentCoordinate[1]) {
        currentCoordinate = coord;
      }
    });

    mapObj.value.overlay.setPosition(currentCoordinate);
    // const popup = document.querySelector("#popup");
    popup.style.display = "block";
  }

  function closeOverlay() {
    mapObj.value.overlay.setPosition(undefined);
    mapObj.value.selectFeature = null;

    return false;
  }

  const colorInit = () => {
    mapObj.value.setColor(currentFacade.value.hover_color, currentFacade.value.opacity);
  };

  const changeFacade = (type) => {
    if (type === "next") {
      activeFacade.value++;
      if (activeFacade.value === facades.value.length) activeFacade.value = 0;
      currentFacade.value = facades.value[activeFacade.value];
    }
    if (type === "prev") {
      if (activeFacade.value === 0) {
        activeFacade.value = facades.value.length - 1;
      } else {
        activeFacade.value--;
      }
      currentFacade.value = facades.value[activeFacade.value];
    }

    existingOverlays.value = mapObj.value.map
      .getOverlays()
      .getArray()
      .slice()[0];

    mapObj.value.map.setTarget(null);
    mapObj.value = null;

    start();
  };
  return {
    start,
    optionsFloor,
    changeFacade,
    currentFacade,
    openedFigure,
    openModal,
    closeOverlay,
    changeFeatureRooms
  };
}
