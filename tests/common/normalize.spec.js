import { normalize } from '../../app/common/Normalize'

describe('(Common functions) Normalize.js', function () {

  let arr = [{field: 0}, {field: 1}];

  it('simple call normalize()', function () {
    let expectedRes = {
      ids: ['0', '1'],
      entities: {
        0: {field: 0},
        1: {field: 1}
      }
    };
    let res = normalize(arr);
    expect(res).to.deep.equal(expectedRes);
  });

  it('call normalize() with callback', function () {
    let expectedRes = {
      ids: ['0', '1'],
      entities: {
        0: {
          field: 0,
          callbackField: true
        },
        1: {
          field: 1,
          callbackField: true
        }
      }
    };
    let res = normalize(arr, item => {
      return {
        ...item,
        callbackField: true
      };
    });
    expect(res).to.deep.equal(expectedRes);
  });


});
