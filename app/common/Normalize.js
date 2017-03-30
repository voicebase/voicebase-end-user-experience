import uuidV1 from 'uuid/v1'

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

export const normalizeWithRandomId = function (arr, entityCallback) {
  let ids = [];
  let entities = {};
  arr.forEach((item) => {
    const id = uuidV1();
    ids.push(id);
    if (entityCallback) {
      entities[id] = entityCallback(item, id)
    }
    else {
      entities[id] = item;
    }
  });

  return {ids, entities};
};
