import { months } from '../common/months'

export const getRandomId = function (prefix) {
  return `${prefix}-${new Date().getTime().toString()}`;
};

export const parseTime = function (seconds) {
  let hours = `${Math.floor(seconds / 3600)}`;
  let minutes = `${Math.floor(seconds % 3600 / 60)}`;
  let _seconds = `${Math.floor(seconds % 3600 % 60)}`;
  return `${padLeft(hours, 2)}:${padLeft(minutes, 2)}:${padLeft(_seconds, 2)}`;
};

export const padLeft = function (string, total) {
  if (typeof string !== 'string') {
    throw new Error('First parameter must be a string');
  }
  if (typeof total !== 'number') {
    throw new Error('Second parameter must be a integer');
  }
  return new Array(total - string.length + 1).join('0') + string;
};

export const replaceAndTrim = function (word) {
  return word.replace(/<br\s*[\/]?>/gi, '').replace(/\n/gi, '').trim();
};

export const getClearWordFromTranscript = function (word) {
  return replaceAndTrim(word).replace(/:$/, '');
};

export const COLORS = [
  '#55a01a',
  '#9932cc',
  '#ff69b4',
  '#6495ed',
  '#ffd700',
  '#f6a7a1',
  '#7fb397',
  '#009999'
];

export const getRandomColor = function () {
  let letters = '012345'.split('');
  let color = '#';
  color += letters[Math.round(Math.random() * 5)];
  letters = '0123456789ABCDEF'.split('');
  for (let i = 0; i < 5; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
};

export const getFileType = function (file) {
  if (file.type.indexOf('audio') > -1) {
    return 'audio';
  }
  else if (file.type.indexOf('video') > -1) {
    return 'video';
  }
  else return 'unknown';
};

export const dateToIso = function (date) {
  return new Date(date).toISOString();
};

export const getDateLabel = function (date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth() + 1].short;
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const sortByField = function (field) {
  var sortOrder = 1;
  if (field[0] === '-') {
    sortOrder = -1;
    field = field.substr(1);
  }
  return function (a, b) {
    var result = (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0;
    return result * sortOrder;
  };
};

export const parseReactSelectValues = function (terms) {
  return terms.map((term) => {
    return (term.value) ? term.value : term;
  })
};
