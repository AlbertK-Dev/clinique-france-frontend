import * as types from './types';

const initialState = {
  datas: [],
  praticiens: [],
  success: false,
  loading: false,
  message: '',
  practitionersCheckedList: { idsList: [], namesList: [] },
};

const PraticiensReducer = (state = initialState, action = undefined) => {
  switch (action.type) {
    case types.CLEAR_ALL_ERR_MSG_PRAT:
      return {
        ...state,
        message: null,
        errorPostingPraticien: null,
        errorUpdatingPraticien: null,
        errordeletingPraticien: null
      }
    case types.GET_PRATICIENS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PRATICIENS_SUCCESS: {
      const { res, selectedValues } = action.payload;
      return {
        ...state,
        loading: false,
        success: true,
        datas: res.data,
        practitionersCheckedList: { ...selectedValues },
      };
    }
    case types.GET_PRATICIENS_FAILED:
      return {
        ...state,
        loading: false,
        success: false,
        message: action.payload.error,
      };
    case types.SAVE_CHECKED_PRACTITIONERS:
      return {
        ...state,
        practitionersCheckedList: { ...action.payload },
      };
    case types.GET_ALL_PRATICIENS_REQUEST:
      return {
        ...state,
        allPratloading: true,
      };
    case types.GET_ALL_PRATICIENS_SUCCESS:
      return {
        ...state,
        allPratloading: false,
        allPratsuccess: true,
        praticiens: action.payload.data,
      };
    case types.GET_ALL_PRATICIENS_FAILED:
      return {
        ...state,
        allPratloading: false,
        allPratsuccess: false,
        message: action.payload.error,
      };

    case types.POST_PRATICIEN_REQUEST:
      return {
        ...state,
        postingPraticien: true,
      };
    case types.POST_PRATICIEN_REQUEST_SUCCESS:
      return {
        ...state,
        postingPraticien: false,
      };
    case types.POST_PRATICIEN_REQUEST_FAILED:
      return {
        ...state,
        postingPraticien: false,
        errorPostingPraticien: action.payload,
      };
    case types.UPDATE_PRATICIEN_REQUEST:
      return {
        ...state,
        UpdatingPraticien: true,
        updatePraticienCompleted:false
      };
    case types.UPDATE_PRATICIEN_REQUEST_SUCCESS:
      return {
        ...state,
        UpdatingPraticien: false,
        updatePraticienCompleted:true
      };
    case types.UPDATE_PRATICIEN_REQUEST_FAILED:
      return {
        ...state,
        UpdatingPraticien: false,
        updatePraticienCompleted:true,
        errorUpdatingPraticien: action.payload,
      };
    case types.UPDATE_PRATICIEN_FINISHED:
      return {
        ...state,
        updatePraticienCompleted: false,
      };
    case types.DELETE_PRATICIEN_REQUEST:
      return {
        ...state,
        deletingPraticien: true,
      };
    case types.DELETE_PRATICIEN_REQUEST_SUCCESS:
      return {
        ...state,
        deletingPraticien: false,
      };
    case types.DELETE_PRATICIEN_REQUEST_FAILED:
      return {
        ...state,
        deletingPraticien: false,
        errordeletingPraticien: action.payload,
      };
    case types.SEARCH_PRATICIEN_REQUEST:
      return {
        ...state,
        searchprat: true,
      };
    case types.SEARCH_PRATICIEN_SUCCESS:
      return {
        ...state,
        searchprat: false,
        praticiens: action.payload
      }
    case types.SEARCH_PRATICIEN_FAILLED:
      return {
        ...state,
        searchprat: false,
        message: action.payload.error
      }
    default:
      return state;
  }
};
export default PraticiensReducer;
