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
import OlDraw, { DrawEvent } from "ol/interaction/Draw";
import { Coordinate, toStringXY } from "ol/coordinate";
import OlSnap from "ol/interaction/Snap";
import { Polygon } from "ol/geom";
import Feature, { FeatureLike } from "ol/Feature";
import { Pixel } from "ol/pixel";
import {
  Facades,
  TDraw,
  TModify,
  TOlMap,
  TSelect,
} from "@/app/types/facadeCanvas";
import { ref } from "vue";
import { Area } from "@/app/types/facades";

export default function createCanvas(
  facade,
  onFigureAdded,
  onOverlayToggled,
) {
  const olMap = ref();
  const sourceVctr = ref(null)
  const start = (modalEl) => {
    olMap.value = new OlMap(facade.image,  'map', function () {
      onMapLoad();
    });
    setMapHeight(modalEl);
  };

  const setMapHeight = function (modalEl) {
    const map = document.querySelector("#map");
    const modalDialog = modalEl.querySelector(".modal-dialog");

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    const marginY =
      parseInt(modalDialog.style.marginTop) +
      parseInt(modalDialog.style.marginBottom);

    map.style.height =
      window.innerHeight -
      (map.getBoundingClientRect().top - scrollTop) -
      marginY +
      "px";
  };

  const colorInit = () => {
    olMap.value.setColor(facade.hover_color, 0.25);
  };

  function OlMap(imageUrl, target, onMapLoad) {
    this.target = target;
    this.imageElement = new Image();

    this.imageElement.onload = () => {
      this.onImageLoad();
      onMapLoad();
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
    const view = this.createView(imageElement);

    this.vector = this.createVector();
    this.overlay = this.createOverlay(document.getElementById("popup"));

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
      className: "ol-map__zoom-slider facade-zoom-slider",
    });

    targetElement.prepend(zoomNode);

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
    this.modify = new Modify(map);
    this.modify.setActive(true);

    this.select = new Select(map);
    this.select.setActive(true);

    this.draw = new Draw(map, vector);
    this.draw.setActive(true);

    this.snap = new Snap(map, vector);
  };

  OlMap.prototype.setColor = function (
    color,
    opacity
  ) {
    this.color = color;
    this.opacity = opacity || 20;

    const style = this.vector?.getStyle();
    if (style) style.getFill().setColor(this.hexToRgba(this.color, this.opacity));
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

  /* Events */

  OlMap.prototype.addEvents = function () {
    this.map.on("click", function () {
      //клик в области карты
    });

    this.map.on("pointermove", function (event) {
      const opacity = olMap.value.opacity === 1 ? 0.99 : olMap.value.opacity;

      const hoverStyle = new Style({
        fill: new Fill({
          color: olMap.value.hexToRgba(olMap.value.color, 1 - opacity),
        }),
        stroke: new Stroke({
          color: "#0000000",
          width: 0.01,
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: olMap.value.hexToRgba(olMap.value.color),
          }),
        }),
      });

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
        olMap.value.features.getArray().indexOf(currentFeature) > -1
      ) {
        olMap.value.hovered = true;
        currentFeature.setStyle(hoverStyle);
        olMap.value.removeStyleFromFeatures(currentFeature);
      } else if (olMap.value.hovered) {
        olMap.value.hovered = false;
        olMap.value.removeStyleFromFeatures();
      }
    });
  };

  OlMap.prototype.removeStyleFromFeatures = function (
    currentFeature
  ) {
    this.sourceVector?.getFeatures().forEach((feature) => {
      if (currentFeature) {
        if (feature.getId() !== currentFeature.getId()) {
          feature.setStyle(olMap.value.createStyle());
        }
      } else {
        feature.setStyle(olMap.value.createStyle());
      }
    });
  };

  /* Vector, Style */

  OlMap.prototype.createVector = function (){
    this.sourceVector = this.createSourceVector();
    sourceVctr.value = this.sourceVector

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
        color: olMap.value.hexToRgba(olMap.value.color, 0.25),
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
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
      zoom: 2,
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
      autoPan: {
        animation: {
          duration: 0,
        },
      },
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

    selectedFeatures.forEach(() => selectedFeatures.remove(this.interaction.getFeatures()[0])
    );
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

  Draw.prototype.isEmpty = function () {
    if (!this.getFeature()) {
      return true;
    }

    const coords = this.getFeature().getGeometry().getCoordinates()[0];

    if (coords.length == 0 || this.isOnePoint(coords)) {
      return true;
    }

    return false;
  };

  Draw.prototype.getFeature = function () {
    return this.sketchFeature_;
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

  function onMapLoad() {
    initFeatures();

    addMapEvents();

    colorInit();
  }

  function initFeatures() {
    (facade.figures || []).forEach(function (item) {
      const feature = new Feature({
        geometry: new Polygon([item.points]),
      });

      feature.setId(item.id);
      feature.set("enrance_id", item.enrance_id);
      feature.set("floor_id", item.floor_id);

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

        rightClickHandler(event);
      });

    olMap.value.draw.interaction.on("change", function () {
      //
    });

    olMap.value.draw.interaction.on("drawstart", function (event) {
      olMap.value.draw.sketchFeature_ = event.target.sketchFeature_;
    });

    olMap.value.draw.interaction.on("drawend", function (event) {
      olMap.value.draw.sketchFeature_ = event.target.sketchFeature_;
      const id = Math.random().toString(16).slice(2);
      
      const feature = event.feature;
      // event.feature.setId(id);
      addFacade(feature);
    });

    // olMap.value.modify.interaction.on("modifyend", function (event) {
    //   console.log("modifyend");

    //   const calls = [];
    //   event.features.forEach(function (feature) {
    //     calls.push(editFacade(feature));
    //   });
    // });

    olMap.value.map.on("dblclick", function (e) {
      if (olMap.value.draw.interaction.getPointerCount()) {
        olMap.value.draw.interaction.removeLastPoint();
        olMap.value.draw.interaction.removeLastPoint();
      }

      showOverlayAtPixel(olMap.value.map.getEventPixel(e.originalEvent));
    });
  }

  function rightClickHandler(event) {
    if (!olMap.value.draw.isEmpty()) {
      olMap.value.draw.interaction.removeLastPoint();
      return;
    }

    if (!olMap.value.draw.isEmpty()) {
      return;
    }

    showOverlayAtPixel(olMap.value.map.getEventPixel(event));
  }

  function showOverlayAtPixel(pixel) {
    const feature = getFeatureAtPixel(pixel);

    if (!feature) {
      return;
    }

    showOverLay(feature);
  }

  function getFeatureAtPixel(pixel) {
    let polygonFeature;

    olMap.value.map.forEachFeatureAtPixel(pixel, function (feature) {
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

  // function editFacade(feature) {
  //   const geom = feature.getGeometry();

  //   console.log(facade, 'editFacadettt');

    
  //   facade.figures.find(
  //     (figure) => figure.id == feature.getId()
  //   ).points = geom.getCoordinates()[0];

  //   showOverLay(feature);
  // }

  function addFacade(feature) {
    const geom = feature.getGeometry();

    const data = {
      id: String(feature.getId()),
      points: geom.getCoordinates()[0],
    };

    onFigureAdded(geom.getCoordinates()[0]).then((figure) => {
      if (figure) {
        feature.setId(figure.id)
        showOverLay(feature);
      }
    })

  }

  function saveOverlay(data) {
    closeOverlay();
  }

  function showOverLay(feature) {
    onOverlayToggled(feature.getId())
    olMap.value.select.clear();

    olMap.value.select.interaction.getFeatures().push(feature);
    olMap.value.selectFeature = feature;

    const coordinates = feature.getGeometry().getCoordinates()[0];
    let currentCoordinate = coordinates[0];

    coordinates.forEach(function (coord) {
      if (coord[0] > currentCoordinate[0] && coord[1] > currentCoordinate[1]) {
        currentCoordinate = coord;
      }
    });

    olMap.value.overlay.setPosition(currentCoordinate);

    addOverlayEvents(feature);
  }

  function addOverlayEvents(feature) {
    const popup = document.querySelector("#popup");
    popup.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    document.getElementById("popup-closer").addEventListener("click", function () {
      closeOverlay();
    });

  }

  function closeOverlay() {
    olMap.value.overlay.setPosition(undefined);
    const popupClose= document
      .querySelector("#popup")
      .querySelector("#popup-closer");
    popupClose.blur();
    olMap.value.selectFeature = null;
    return false;
  }

  function deleteSelectedFeature(feature_id) {
    const feature = sourceVctr.value.getFeatures().find((feature) => feature.getId() == feature_id)
    if (feature) {
      olMap.value.sourceVector.removeFeature(feature);
      closeOverlay();
    }
  }

  return {
    start,
    olMap,
    saveOverlay,
    showOverLay,
    deleteSelectedFeature,
  };
}
