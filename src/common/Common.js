export const parseTime = function (seconds) {
  let hours = `${Math.floor(seconds / 3600)}`;
  let minutes = `${Math.floor(seconds % 3600 / 60)}`;
  let _seconds = `${Math.floor(seconds % 3600 % 60)}`;
  return `${padLeft(hours, 2)}:${padLeft(minutes, 2)}:${padLeft(_seconds, 2)}`;
};

export const padLeft = function (string, total) {
  return new Array(total - string.length + 1).join('0') + string;
};

