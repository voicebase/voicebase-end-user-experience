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
  let letters = '012345'.split('');
  let color = '#';
  color += letters[Math.round(Math.random() * 5)];
  letters = '0123456789ABCDEF'.split('');
  for (let i = 0; i < 5; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
};
