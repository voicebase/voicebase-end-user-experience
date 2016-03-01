import {
  parseTime,
  padLeft,
  replaceAndTrim,
  getClearWordFromTranscript,
  getRandomColor,
  getFileType,
  dateToIso
} from '../../src/common/Common'

describe('(Common functions) Common.js', function () {
  describe('padLeft()', function () {
    it('check padLeft with non-string first parameter', function () {
      expect(function () {
        padLeft(2, 2);
      }).to.throw(Error)
    });

    it('check padLeft with non-number second parameter', function () {
      expect(function () {
        padLeft('2', '2');
      }).to.throw(Error)
    });

    it('check padLeft', function () {
      let str = "2";
      expect(padLeft(str, 0)).to.equal(str);
      expect(padLeft(str, 1)).to.equal(str);
      expect(padLeft(str, 2)).to.equal('0' + str);
      expect(padLeft(str, 3)).to.equal('00' + str);
    });
  });

  it('check parseTime', function () {
    expect(parseTime(0)).to.equal("00:00:00");
    expect(parseTime(null)).to.equal("00:00:00");
    expect(parseTime(360)).to.equal("00:06:00");
  });

  it('check replaceAndTrim', function () {
    expect(replaceAndTrim('   <br><br  ><br/><br />')).to.equal('');
    expect(replaceAndTrim('    \n   ')).to.equal('');
  });

  it('check getClearWordFromTranscript', function () {
    expect(getClearWordFromTranscript('word:   <br><br  ><br/><br />')).to.equal('word');
  });

  it('check getRandomColor', function () {
    var color = getRandomColor();
    assert.isTrue(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color));
  });

  it('check getFileType', function () {
    expect(getFileType({type: 'audio/mp3'})).to.equal('audio');
    expect(getFileType({type: 'video/mp4'})).to.equal('video');
    expect(getFileType({type: 'mp4'})).to.equal('unknown');
  });

  it('check dateToIso for YYYY-MM-DD', function () {
    let date = '2016-02-29';
    let isoDate = dateToIso(date);
    expect(new Date(date).toUTCString()).to.equal(new Date(isoDate).toUTCString());
  });

});
