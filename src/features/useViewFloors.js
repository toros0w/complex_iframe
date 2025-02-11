import Map from "ol/Map";
import ZoomSlider from "ol/control/ZoomSlider";
import Zoom from "ol/control/Zoom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Collection from "ol/Collection";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import View from "ol/View";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";
import { Projection } from "ol/proj";
import Overlay from "ol/Overlay";
import OlModify from "ol/interaction/Modify";
import { shiftKeyOnly, singleClick } from "ol/events/condition";
import OlSelect from "ol/interaction/Select";
import OlDraw from "ol/interaction/Draw";
import { toStringXY } from "ol/coordinate"; // Coordinate, 
import OlSnap from "ol/interaction/Snap";
import { Polygon } from "ol/geom"; // Geometry, Point, 
import Feature, { FeatureLike } from "ol/Feature";
// import { Pixel } from "ol/pixel";
// import { Area, TDraw, TModify, TSelect } from "@/app/types/facadeViewCanvas";
import { nextTick, ref } from "vue";

/*type TOlMap = {
  map: Map;
  features: any;
  sourceVector: VectorSource;
  draw: TDraw;
  modify: TModify;
  select: TSelect;
  snap: OlSnap;
  imageElement: HTMLImageElement;
  imageLayer: ImageLayer<Static>;
  target: string;
  vector: VectorLayer<VectorSource>;
  overlay: Overlay;
  color: string;
  opacity: number;
  hovered: boolean;
  zoomSliderWrapper: HTMLElement;
  popupWrapper: HTMLElement;
  isMouseOverMap: boolean;
  onImageLoad: () => void;
  createMap: (imageElement: HTMLImageElement, target: string) => void;
  addInteractionsToMap: (map: Map, vector: VectorLayer<VectorSource>) => void;
  setColor: (color: string, opacity: number) => void;
  hexToRgba: (hex: string, opacity?: number) => string;
  addEvents: () => void;
  removeStyleFromFeatures: (currentFeature?: Feature) => void;
  createVector: () => VectorLayer<VectorSource>;
  createSourceVector: () => VectorSource;
  createStyle: () => Style;
  createView: (imageElement: HTMLImageElement) => View;
  createProjection: (imageElement: HTMLImageElement) => Projection;
  createImageLayer: (imageElement: HTMLImageElement) => ImageLayer<Static>;
  createImageStatic: (imageElement: HTMLImageElement) => Static;
  createOverlay: (container: HTMLElement) => Overlay;
};*/
export default function useViewFloors() {
  const olMap = ref();
  const openWindowInfo = ref(false);
  const windowInfoData = ref({});
  const areas = ref([])
  const image = ref(null)
  const hoveredFigure = ref(null)


  function start(
    map,
    container,
    zoomSliderWrapper,
    popupWrapper,
    imageUrl,
    figures
  ) {
    areas.value = figures
    image.value = imageUrl

    olMap.value = new OlMap(
      image.value,
      map || "map",
      zoomSliderWrapper,
      popupWrapper,
      function (olMap) {
        onMapLoad(olMap);
      }
    );

    // setMapHeight(map, container);
  }

  // const setMapHeight = function (map, container) {
  //   const scrollTop =
  //     window.pageYOffset ||
  //     document.documentElement.scrollTop ||
  //     document.body.scrollTop;

  //   const marginY =
  //     parseInt(container.style.marginTop) +
  //     parseInt(container.style.marginBottom);

    // map.style.height = container.clientHeight -
        // (map.getBoundingClientRect().top - scrollTop) -
        // marginY +
        // "px";
  // };

  function OlMap(
    
    imageUrl,
    target,
    zoomContainer,
    popupWrapper,
    onMapLoad
  ) {
    this.target = target;
    this.imageElement = new Image();
    this.zoomSliderWrapper = zoomContainer;
    this.popupWrapper = popupWrapper;

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
    document.querySelector('.ol-map__zoom')?.remove()
    document.querySelector('.ol-map__pane')?.remove()
    
    this.imageLayer = this.createImageLayer(imageElement);

    const targetElement = document.getElementById(target);
    const view = this.createView(imageElement);

    this.vector = this.createVector();
    this.overlay = this.createOverlay(this.popupWrapper);

    const paneNode = document.createElement("div");
    paneNode.className = "ol-map__pane";

    targetElement.appendChild(paneNode);

    this.map = new Map({
      layers: [this.imageLayer, this.vector],
      overlays: [this.overlay],
      controls: [],
      target: paneNode,
      view: view,
      pixelRatio: 1,
    });

    const zoomNode = document.createElement("div");
    zoomNode.className = "ol-map__zoom";

    const zoomSlider = new ZoomSlider({
      className: "ol-map__zoom-slider",
    });

    this.zoomSliderWrapper.prepend(zoomNode);

    zoomSlider.setTarget(zoomNode);
    this.map.addControl(zoomSlider);

    const ctrlButtons = new Zoom({
      target: zoomNode,
      className: "ol-map__zoom-btns",
      zoomInLabel: "+",
      zoomOutLabel: "\u2212",
      delta: 1,
    });

    const zoomLabelNode = document.createElement("div");
    zoomLabelNode.className = "ol-map__zoom-label";
    zoomLabelNode.textContent = "масштаб";

    zoomNode.appendChild(zoomLabelNode);
    this.map.addControl(ctrlButtons);
    this.addInteractionsToMap(this.map, this.vector);
    this.addEvents();
  };

  OlMap.prototype.addInteractionsToMap = function (
    
    map,
    vector
  ) {
    // this.modify = new Modify(map);
    // this.modify.setActive(true);

    // this.select = new Select(map);
    // this.select.setActive(true);

    // this.draw = new Draw(map, vector);
    // this.draw.setActive(true);

    this.snap = new Snap(map, vector);
  };

  OlMap.prototype.setColor = function (
    
    color,
    opacity
  ) {
    this.color = color;
    this.opacity = opacity || 20;

    const style = this.vector.getStyle();
    style.getFill().setColor(this.hexToRgba(this.color, this.opacity / 100));
  };

  OlMap.prototype.hexToRgba = function (
    
    hex,
    opacity
  ){
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

  /* Events */

  OlMap.prototype.addEvents = function () {
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
      openWindowInfo.value = true;
      windowInfoData.value = {};
    });

    this.map.getViewport().addEventListener("mouseover", () => {
      this.isMouseOverMap = true;
    });

    this.map.getViewport().addEventListener("mouseout", () => {
      this.isMouseOverMap = false;
    });

    this.map.getViewport().addEventListener("wheel", (event) => {
      if (!this.isMouseOverMap) {
        event.preventDefault();
      }
    });

    this.map.on("pointermove", function (event) {
      let currentFeature;

      this.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          if (feature.getGeometry().getType() == "Polygon") {
            currentFeature = feature;
          }
        }
      );

      olMap.value.removeStyleFromFeatures(currentFeature)

      if (
        currentFeature &&
        olMap.value.features.getArray().indexOf(currentFeature) > -1
      ) {
        olMap.value.hovered = true;
        showOverLay(currentFeature);
        this.getTargetElement().style.cursor = "pointer";
      } else if (olMap.value.hovered) {
        closeOverlay();
        olMap.value.hovered = false;
        this.getTargetElement().style.cursor = "default";
      }
    });
  };

  OlMap.prototype.removeStyleFromFeatures = function (
    
    currentFeature
  ) {
    this.sourceVector?.getFeatures().forEach(function (feature) {
      if (feature !== currentFeature) {
        feature.setStyle(
          new Style({
            fill: new Fill({
              color: olMap.value.hexToRgba(feature.get('visible') ? "#4caf50" : "#cfcfcf", 0.7),
            }),
          })
        );
      }
    });
  };

  /* Vector, Style */

  OlMap.prototype.createVector = function (
    
  ){
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
        color: "rgba(255, 56, 56, 0.2)",
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 0.1,
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: "#ffcc33",
        }),
      }),
    });
  };

  /* View, Layer, Image */

  OlMap.prototype.createView = function (
    
    imageElement
  ) {
    const projection = this.createProjection(imageElement);

    return new View({
      projection: projection,
      center: getCenter([0, 0, imageElement.width, imageElement.height]),
      zoom: 0,
      minZoom: 1,
      maxZoom: 6,
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

  OlMap.prototype.createOverlay = function (
    
    container
  ) {
    return new Overlay({
      element: container,
      autoPan: true,
      insertFirst: true,
    });
  };

  /* Interactions */
  

  function Modify(map) {
    this.interaction = new OlModify({
      features: olMap.value ? olMap.value.features : new Collection(),
      deleteCondition: function (event) {
        return shiftKeyOnly(event) && singleClick(event);
      },
    });

    map.addInteraction(this.interaction);
  }

  Modify.prototype.setActive = function (active) {
    this.interaction.setActive(active);
  };

  
  function Select(map) {
    this.interaction = new OlSelect();
    map.addInteraction(this.interaction);
    this.setEvents();
  }

  Select.prototype.setEvents = function () {
    this.interaction.on(
      "change:active",
      function () {
        this.clear();
      }.bind(this)
    );
  };

  Select.prototype.setActive = function (active) {
    this.interaction.setActive(active);
  };

  Select.prototype.clear = function () {
    const selectedFeatures = this.interaction.getFeatures();

    // selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
  };

  /**
   * type TDraw
   */


  function Draw(map, vector) {
    this.interaction = new OlDraw({
      source: vector.getSource(),
      type: /** @type {ol.geom.GeometryType} */ "Polygon",
      freehand: false,
      condition: function (event) {
        // Left Click
        return event.originalEvent.which == 1;
      },
    });

    this.interaction.setActive(false);
    map.addInteraction(this.interaction);
  }

  Draw.prototype.coordToString = function (coordXY) {
    return toStringXY(coordXY, 3);
  };

  Draw.prototype.isOnePoint = function (
    
    coords
  ) {
    return coords.every(
      function (coordXY) {
        return this.coordToString(coords[0]) == this.coordToString(coordXY);
      }.bind(this)
    );
  };

  Draw.prototype.getFeature = function () {
    // return this.interaction.sketchFeature_;
  };

  Draw.prototype.getActive = function () {
    return this.interaction && this.interaction.getActive();
  };

  Draw.prototype.setActive = function (active) {
    this.interaction.setActive(active);
  };

  function Snap(map, vector) {
    const snap = new OlSnap({
      source: vector.getSource(),
    });

    map.addInteraction(snap);
  }

  const colorInit = () => {
    olMap.value.setColor("#FF3838", 0.2);
  };

  function onMapLoad(olMap) {
    initFeatures();

    addMapEvents();

    colorInit();
  }


  function initFeatures() {
    areas.value.forEach(function (item) {
      // const feature = new Feature({
      //   geometry: new Polygon([item.points]),
      // });

      const feature = new Feature(new Polygon([item.points]));

      feature.setId(item.id);
      feature.set('visible', item.visible)
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: olMap.value.hexToRgba(item.visible ? "#4caf50" : "#cfcfcf", 0.7),
          }),
        })
      );

      const geo = feature.getGeometry()
      const center = getCenter(geo.getExtent());
      const imageCenter = getCenter(olMap.value.imageLayer.values_.source.getImageExtent())
      // geo.setFlatCoordinates([item.points.map(([x, y]) => [x, y ])])
      geo.scale(1, -1, imageCenter)
      // geo.rotate(270, center)

      try {
        olMap.value.sourceVector.addFeature(feature);
      } catch (e) {
        location.reload();
      }
    });
  }

  function addMapEvents() {
    if (!olMap.value) return;
    olMap.value.map
      .getViewport()
      .addEventListener("contextmenu", function (event) {
        event.preventDefault();

        // rightClickHandler(event);
      });

    // olMap.value.draw.interaction.on("change", function (event) {
    //   console.log(event);
    // });

    // olMap.value.draw.interaction.on("drawstart", function (event) {
    //   console.log(event);
    // });

    // olMap.value.draw.interaction.on("drawend", function (event) {
    //   const feature: Feature<Polygon> = event.feature as Feature<Polygon>;
    //   addFacade(feature);
    // });

    // olMap.value.modify.interaction.on("modifyend", function (event) {
    //   const calls = [];
    // });

    olMap.value.map.on("dblclick", function (e) {
      if (olMap.value.draw?.interaction.getPointerCount()) {
        olMap.value.draw.interaction.removeLastPoint();
        olMap.value.draw.interaction.removeLastPoint();
      }

      showOverlayAtPixel(olMap.value.map.getEventPixel(e.originalEvent));
    });
  }

  function rightClickHandler(event) {
    if (olMap.value.draw.interaction.getPointerCount() !== 0) {
      olMap.value.draw.interaction.removeLastPoint();
      return;
    }

    if (olMap.value.draw.interaction.getPointerCount() !== 0) {
      return;
    }

    showOverlayAtPixel(olMap.value.map.getEventPixel(event));
  }

  function showOverlayAtPixel(pixel) {
    const feature = getFeatureAtPixel(pixel);

    if (!feature) {
      return;
    }
  }

  function getFeatureAtPixel(pixel) {
    let polygonFeature;

    olMap.value.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
      if (
        feature.getGeometry().getType() == "Polygon" &&
        olMap.value.features.getArray().indexOf(feature) >
          -1
      ) {
        polygonFeature = feature;
      }
    });

    return polygonFeature;
  }

  // function addFacade(feature) {
  //   const geom = feature.getGeometry();

  //   const id = Math.random().toString(16).slice(2);
  //   const data = {
  //     id,
  //     points: geom.getCoordinates()[0],
  //   };

  //   areas.push(data);

  //   localStorage.setItem("areas", JSON.stringify(areas));

  //   showOverLay(feature);
  // }

  function showOverLay(feature) {
    closeOverlay()
    // onOverlayToggled(feature.id_)
    hoveredFigure.value = feature
    // olMap.value.select.clear();
    // olMap.value.select.interaction.getFeatures().push(feature);

    const geo = feature.getGeometry();
    const center = getCenter(geo.getExtent());

    // hoveredFigure.value.visible
    feature.setStyle(
      new Style({
        fill: new Fill({
          color: olMap.value.hexToRgba("#cfcfcf", 0.1),
        }),
        stroke: new Stroke({
          color: "#FF3838",
          width: 0.1,
        }),
      })
    );
    nextTick(() => {
      if (!hoveredFigure.value.visible) {
        return
      }
      olMap.value.overlay.setPosition(center);
      olMap.value.overlay.setPositioning("top-center");
  
      addOverlayEvents(feature);
    })
  }

  function addOverlayEvents(feature) {
    const popup = document.querySelector("#popup");
    popup.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  function closeOverlay(feature) {
    if (hoveredFigure.value) {
      hoveredFigure.value.setStyle(
        new Style({
          fill: new Fill({
            color: olMap.value.hexToRgba(hoveredFigure.value.visible ? "#4caf50" : "#cfcfcf", 0.7),
          }),
        })
      );
    } 
    hoveredFigure.value = null
    olMap.value.overlay.setPosition(undefined);
    return false;
  }

  return {
    openWindowInfo,
    windowInfoData,
    start,
    hoveredFigure,
  };
}
