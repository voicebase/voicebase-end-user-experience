export const parseTime = function (seconds) {
  let hours = `${Math.floor(seconds / 3600)}`;
  let minutes = `${Math.floor(seconds % 3600 / 60)}`;
  let _seconds = `${Math.floor(seconds % 3600 % 60)}`;
  return `${padLeft(hours, 2)}:${padLeft(minutes, 2)}:${padLeft(_seconds, 2)}`;
};

export const padLeft = function (string, total) {
  return new Array(total - string.length + 1).join('0') + string;
};

export const replaceAndTrim = function (word) {
  return word.replace(/<br\s*[\/]?>/gi, '').replace(/\n/gi, '').trim();
};

export const getClearWordFromTranscript = function (word) {
  return replaceAndTrim(word).replace(/:$/, '');
};

export const getRandomColor = function () {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
