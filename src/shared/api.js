import axios from "axios"
// const URL = process.env.VUE_APP_API_URL;
const URL = 'http://localhost';


console.log(URL, 'URL URL');

const api_instance =  axios.create({
    baseURL: `${URL}/ajax/vue_ajax/complex_axios.php`
})

const get_user_id = () => {
    if (window.auth_user_id) {
        return window.auth_user_id
    }
    window.auth_user_id = document.getElementById('session_user_id').value
    return window.auth_user_id
}

const callApi = (request, params = {}) => {
    return api_instance.post('', {
        request,
        user_id: get_user_id(),
        ...params
    })
}

const callWithFormData = (request, formData) => {
    formData.append("request", request);
    formData.append("user_id", get_user_id());
    return api_instance.post('', formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
}

// Entrances
const getHouseEntrances = (house_id, includes = []) => callApi('get_house_entrances', {includes, house_id})

const createEntrance = (house_id, fields ) => callApi('add_house_entrance', {house_id, fields})

const updateEntrance = (entrance_id, fields) => callApi('update_house_entrance', {entrance_id, fields})

const deleteEntrance = (entrance_id) => callApi('delete_house_entrance', {entrance_id})

const getComplexEntrances = (complex_id, includes = []) => callApi('get_complex_entrances', {includes, complex_id})

// Complexes
const getComplexOne = (complex_id, object_list = false) => callApi('get_complex_one', { complex_id, object_list})

const getComplex = (country_id, region_id) => callApi('get_complex', {country_id, region_id})
const getComplexStatus  = () => callApi('get_complex_status')
const searchComplexes = (filter = {}, page, use_empty_rooms) => callApi('search', {filter, page, use_empty_rooms})
const getComplexTypes = () => callApi('get_types_complex')
const saveComplex = (complex, newBuilderPhone, newBuilderLink) => callApi('save_complex', {complex, newBuilderPhone, newBuilderLink })
const archiveComplex = (payload) => callApi('complex_archive', payload)
const deleteComplex = (complex_id) => callApi('complex_delete', { complex_id })

const addPhotoToComplex = (formData) =>  callWithFormData('add_photos_to_complex', formData)
const updateComplexPhoto = (formData) => callWithFormData('update_complex_photo', formData)
const deleteComplexPhoto = (photo_id) => callApi('delete_complex_photo', {photo_id})
// Houses
const getComplexHouses = (complex_id) => callApi('get_houses', {complex_id})

const getHouseOne = (house_id, includes = []) => callApi('get_house_one', {house_id, includes})

const getHouseTypes = () => callApi('get_house_types')

const addEditHouse = (house) => callApi('add_edit_house', {house})

const addPhotoToHouse = (formData) => callWithFormData('add_photos_to_house', formData)
const deleteHousePhoto = (photo_id) => callApi('delete_house_photo', {photo_id})
// Floors
const createFloor = (entrance_id, fields) => callApi('create_floor', {fields, entrance_id})
const updateFloor = (floor_id, fields) => callApi('update_floor', {floor_id, fields})
const deleteFloor = (floor_id) => callApi('delete_floor', {floor_id})
const copyFloor = (floor_id, position) => callApi('copy_floor', {floor_id, position})

// Floor Plans
const getFloorPlans = (house_id) => callApi('get_house_floors_plans', {house_id})
const getFloorPlan = (floor_plan_id) => callApi('get_floor_plan', {floor_plan_id})
const getHouseFloorPlans = (house_id) => callApi('get_entrances_floor_plans', {house_id})
const updateFloorPlans = (plan_ids = [], floor_ids = [], fields, use_bulk = false) => callApi('update_house_floor_plans', {plan_ids, floor_ids, fields, use_bulk})
const deleteFloorPlan = (floor_plan_id) => callApi('delete_floor_plan', {floor_plan_id})
const addFloorPlan = (formData) => callWithFormData('add_floor_plan_to_house', formData)
const updateFloorPlanPhoto = (formData) => callWithFormData('update_photo_floor_plan', formData)
// Floor Plan Figures
const deleteFloorPlanFigure = (figure_id) => callApi('delete_floor_plan_figure', {figure_id})

const addFigureToFloorPlan = (floor_plan_id, fields) => callApi('add_floor_plan_figure', {floor_plan_id, fields})

const updateFigure = (figure_id, fields) => callApi('update_floor_plan_figure', {figure_id, fields})

// Facades
const getFacades = (house_id, includes = []) => callApi('get_house_facades', {house_id, includes})

const deleteHouseFacade = (facade_id) => callApi('delete_house_facade', {facade_id})

const addFacadeToHouse = (formData) => callWithFormData('add_facade_to_house', formData)

const updateFacade = (facade_id, fields) => callApi('update_house_facade', {facade_id, fields})

// Facade Figures
const addFigureToFacade = (facade_id, points) => callApi('add_facade_figure', {facade_id, points})
const deleteFacadeFigure = (figure_id) => callApi('delete_facade_figure', {figure_id})
const updateFacadeFigure = (figure_id, fields) => callApi('update_facade_figure', {figure_id, fields})

// Rooms
const updateRoom = (room) => callApi('update_room', {room})
const saveRoom = (room) => callApi('save_room', {room})
const get_room_entrance = (id) => callApi('get_room_entrance', {id});
const deleteRoom = (room_id) => callApi('delete_room', {room_id})
const copyRoom = (room_id, {floor_id, position, copies_count, floors_with_position }) => callApi('copy_room', {room_id, floor_id, position, copies_count, floors_with_position})
const getRoomRequisition = (id) => callApi('get_room_requisition', {id});

// Room Plans
const createRoomPlan = (formData) => callWithFormData('add_plan_to_house', formData)
const connectRoomsToPlan = (room_ids, plan_id) => callApi('update_rooms_plan_link', {room_ids, plan_id})
const sendRoomsToAdvert = (room_ids, house_id, type) => callApi('send_rooms_to_advert', {room_ids, house_id, type})
const deleteRoomPlans = (plan_ids) => callApi('delete_house_plans', {plan_ids})

const getHousePlans = (house_id) => callApi('get_house_plans', {house_id})

const updateRoomPlans = (plan_ids, fields) => callApi('update_house_plans', {plan_ids, fields})

// Room Plan Photos

const addPhotoRomRoomPlan = (formData) => callWithFormData('add_photos_to_room_plan', formData)
const updateRoomPlanPhotoPosition = (image_id, position) => callApi('update_plan_photo_position', {image_id, position})
const deleteRoomPlanPhoto = (photo_id) => callApi('delete_photo_from_room_plan', photo_id)

// Country 
const getCountry = () => callApi('get_country')

// Metro 

const getMetro = (region_id) => callApi('get_metro', {region_id})

// Regions

const getRFRegions = () => callApi('get_rf_regions')

// Decorations
const getDecorations = () => callApi('get_decorations')

// Windows placements
const getWindowsPlacements = () => callApi('get_windows_placements')

const deleteHouse = (house_id) => callApi('delete_house', { house_id })

const getComplexSuggestions = (use_empty_rooms = false) => callApi('get_complex_names', { use_empty_rooms })

const saveHouseUTP = (formData) => callWithFormData('save_house_utp', formData)

const saveHouseDecoration = (formData) => callWithFormData('save_house_decoration', formData)

const deleteHouseUtp = (id) => callApi('delete_house_utp', { id })

const deleteHouseDecoration = (id) => callApi('delete_house_decoration', { id })

const saveComplexAction = (formData) => callWithFormData('save_complex_action', formData)

const deleteComplexAction = (id) => callApi('delete_complex_action', { id })

const getBuilders = () => callApi('get_builders');

const getAllHouses = () => callApi('get_all_houses')

const createImport = (formData) => callWithFormData('create_import', formData);

const getHouseImport = (import_id) => callApi('get_house_import', { import_id })

const getHouseImportStatus = (import_id) => callApi('get_house_import_status', { import_id })

const updateHouseImport = (import_id, fields) => callApi("update_house_import", { import_id, fields })

const getRoomFigures = (room_id) => callApi('get_room_figures', { room_id })

const getFilterFields = (house_id) => callApi("get_filter_fields", { house_id }) 

export default {
    URL,
    callApi,
    getHouseEntrances,
    getComplexEntrances,
    createEntrance,
    updateEntrance,
    getComplexHouses,
    getComplexOne,
    searchComplexes,
    deleteEntrance,
    updateFloor,
    getHouseOne,
    getFloorPlan,
    updateFloorPlans,
    deleteFloorPlanFigure,
    addFigureToFloorPlan,
    updateFigure,
    deleteHouseFacade,
    addFacadeToHouse,
    updateFacade,
    getFacades,
    connectRoomsToPlan,
    sendRoomsToAdvert,
    addPhotoToHouse,
    deleteHousePhoto,
    getHousePlans,
    updateRoom,
    deleteRoom,
    addFigureToFacade,
    deleteFacadeFigure,
    updateFacadeFigure,
    getComplexTypes,
    getCountry,
    getMetro,
    getRFRegions,
    saveComplex,
    archiveComplex,
    deleteComplex,
    getComplex,
    getComplexStatus,
    getDecorations,
    getWindowsPlacements,
    getHouseTypes,
    addEditHouse,
    copyRoom,
    createFloor,
    deleteFloor,
    copyFloor,
    addFloorPlan,
    getFloorPlans,
    deleteFloorPlan,
    getHouseFloorPlans,
    saveRoom,
    get_room_entrance,
    getRoomRequisition,
    updateFloorPlanPhoto,
    updateComplexPhoto,
    deleteComplexPhoto,
    addPhotoToComplex,
    createRoomPlan,
    deleteRoomPlans,
    updateRoomPlans,
    addPhotoRomRoomPlan,
    updateRoomPlanPhotoPosition,
    deleteRoomPlanPhoto,
    deleteHouse,
    getComplexSuggestions,
    saveHouseUTP,
    saveHouseDecoration,
    deleteHouseUtp,
    deleteHouseDecoration,
    saveComplexAction,
    deleteComplexAction,
    getBuilders,
    getAllHouses,
    createImport,
    getHouseImport,
    updateHouseImport,
    getHouseImportStatus,
    getRoomFigures,
    getFilterFields
}