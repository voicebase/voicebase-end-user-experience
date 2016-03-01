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
