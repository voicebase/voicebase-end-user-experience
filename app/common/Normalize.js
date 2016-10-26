export const normalize = function (arr, entityCallback) {
  let ids = [];
  let entities = {};
  arr.forEach((item, i) => {
    ids.push(i.toString());
    if (entityCallback) {
      entities[i] = entityCallback(item, i)
    }
    else {
      entities[i] = item;
    }
  });

  return {ids, entities};
};
