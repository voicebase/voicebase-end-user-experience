import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable';
import { normalizeWithRandomId } from '../../common/Normalize'
import { getFileType } from '../../common/Common'
import { pushError } from './error'
import { addProcessingMedia } from './media/mediaList'
import MediaApi from '../../api/mediaApi'

/*
 * Constants
 * */
export const ADD_FILES = 'ADD_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const POST_FILE = 'POST_FILE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_PRIORITY = 'SET_PRIORITY';
export const SET_PREDICTION = 'SET_PREDICTION';
export const SET_DETECTION = 'SET_DETECTION';
export const SET_NUMBERS = 'SET_NUMBERS';
export const SET_GROUPS = 'SET_GROUPS';
export const SET_VOCABULARY = 'SET_VOCABULARY';
export const SET_CUSTOM_TERMS = 'SET_CUSTOM_TERMS';
export const SET_IS_STEREO = 'SET_IS_STEREO';
export const SET_SPEAKER = 'SET_SPEAKER';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
export const CHOOSE_TAB = 'CHOOSE_TAB';
export const FILES_PREVIEW_TAB = 1;
export const OPTIONS_TAB = 2;

/*
 * Actions
 * */
export const addFiles = createAction(ADD_FILES, (files) => files);
export const removeFile = createAction(REMOVE_FILE, (id) => id);

export const _postFilePending = createAction(`${POST_FILE}_PENDING`, (fileId) => fileId);

export const postFile = (token, fileId, file, options) => {
  return (dispatch) => {
    dispatch(_postFilePending(fileId));
    MediaApi.postMedia(token, fileId, file, options)
      .then((response) => {
        dispatch(removeFile(fileId));
        dispatch(addProcessingMedia({
          mediaId: response.mediaId,
          status: response.status,
          metadata: response.metadata
        }));
      })
      .catch((error) => {
        dispatch(pushError(error));
        dispatch(removeFile(fileId));
      })
  };
};

export const setLanguage = createAction(SET_LANGUAGE, (language) => language);
export const setPriority = createAction(SET_PRIORITY, (priority) => priority);
export const setPrediction = createAction(SET_PREDICTION, (predictionIds) => predictionIds);
export const setDetection = createAction(SET_DETECTION, (detectionIds) => detectionIds);
export const setNumbers = createAction(SET_NUMBERS, (numberIds) => numberIds);
export const setGroups = createAction(SET_GROUPS, (groupIds) => groupIds);
export const setVocabulary = createAction(SET_VOCABULARY, (vocabulary) => vocabulary);
export const setCustomTerms = createAction(SET_CUSTOM_TERMS, (terms) => terms);
export const setIsStereo = createAction(SET_IS_STEREO, (isStereo) => isStereo);
export const setSpeaker = createAction(SET_SPEAKER, (speakerType, speakerName) => {
  return {speakerType, speakerName};
});

// view
export const cancelUpload = createAction(CANCEL_UPLOAD);
export const chooseTab = createAction(CHOOSE_TAB, (tabId) => tabId);

export const actions = {
  addFiles,
  removeFile,
  postFile,
  setLanguage,
  setPriority,
  setPrediction,
  setDetection,
  setNumbers,
  setGroups,
  setVocabulary,
  setCustomTerms,
  setIsStereo,
  setSpeaker,
  cancelUpload,
  chooseTab
};

/*
 * State
 * */
export const initialState = fromJS({
  view: {
    showForm: false,
    activeTab: FILES_PREVIEW_TAB,
    isStereoFile: false,
    showVocabularies: true
  },
  fileIds: [],
  files: {},
  options: {
    speakers: {
      left: 'Speaker 1',
      right: 'Speaker 2'
    },
    vocabularies: [],
    customTerms: []
  }
});

/*
 * Reducers
 * */
export default handleActions({
  [ADD_FILES]: (state, { payload: newFiles }) => {
    let result = normalizeWithRandomId(newFiles, (file) => {
      let type = getFileType(file);
      return { file, type }
    });

    const fileIds = state.get('fileIds').concat(result.ids);
    const files = state.get('files').merge(result.entities);

    return state
      .merge({fileIds, files})
      .mergeIn(['view'], {
        showForm: true,
        activeTab: FILES_PREVIEW_TAB
      });
  },

  [REMOVE_FILE]: (state, { payload: id }) => {
    let fileIds = state.get('fileIds').filter(fileId => fileId !== id);
    return state
      .set('fileIds', fileIds)
      .deleteIn(['files', id]);
  },

  [POST_FILE + '_PENDING']: (state, {payload: fileId}) => {
    return state
      .mergeIn(['files', fileId], {
        isPostPending: true
      })
      .setIn(['view', 'showForm'], false);
  },

  [CANCEL_UPLOAD]: () => {
    return initialState;
  },

  [CHOOSE_TAB]: (state, { payload: tabId }) => {
    return state.setIn(['view', 'activeTab'], tabId);
  },

  [SET_LANGUAGE]: (state, { payload: language }) => {
    return state.setIn(['options', 'language'], language);
  },

  [SET_PRIORITY]: (state, { payload: priority }) => {
    return state.setIn(['options', 'priority'], priority);
  },

  [SET_PREDICTION]: (state, { payload: predictionIds }) => {
    return state.setIn(['options', 'predictions'], predictionIds);
  },

  [SET_DETECTION]: (state, { payload: detectionIds }) => {
    return state.setIn(['options', 'detection'], detectionIds);
  },

  [SET_NUMBERS]: (state, { payload: numberIds }) => {
    return state.setIn(['options', 'numbers'], numberIds);
  },

  [SET_GROUPS]: (state, { payload: groupIds }) => {
    return state.setIn(['options', 'groups'], groupIds);
  },

  [SET_VOCABULARY]: (state, { payload: vocabulary }) => {
    return state.setIn(['options', 'vocabularies'], vocabulary);
  },

  [SET_CUSTOM_TERMS]: (state, { payload: terms }) => {
    return state.setIn(['options', 'customTerms'], terms);
  },

  [SET_IS_STEREO]: (state, { payload: isStereo }) => {
    return state.setIn(['view', 'isStereoFile'], isStereo);
  },

  [SET_SPEAKER]: (state, { payload }) => {
    return state.setIn(['options', 'speakers', payload.speakerType], payload.speakerName);
  }
}, initialState);
