import Fuse from 'fuse.js';

export const localSearch = function (transcript, searchString) {
  let result = [];

  let fuseEngine = new Fuse(transcript, {
    keys: ['w'],
    threshold: 0.2
  });

  let terms = searchString.split(' ');
  console.time('fuse');
  terms.forEach(term => {
    let res = fuseEngine.search(term);
    res = res.map(resItem => {
      return {
        time: resItem.s / 1000,
        keywordName: resItem.w
      }
    });
    result = result.concat(res);
  });
  console.timeEnd('fuse');

  return result;
};
