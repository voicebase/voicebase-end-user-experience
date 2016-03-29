import Fuse from 'fuse.js';
import { COLORS, getRandomColor } from './Common'

export const localSearch = function (transcript, searchString) {
  console.time('localSearch');
  let fuseEngine = createEngine(transcript, ['w']);
  let terms = searchStringToTerms(searchString);
  let { phrases, words } = parseTerms(terms);

  let wordsResult = searchWords(words, fuseEngine);
  let phrasesResult = searchPhrases(transcript, phrases, fuseEngine);

  console.timeEnd('localSearch');
  return Object.assign({}, wordsResult, phrasesResult);
};

export const searchPhrases = function (transcript, phrases, fuseEngine) {
  console.time('indexOf');
  let result = {};

  phrases.forEach(phrase => {
    let innerWords = splitPhrase(phrase);
    var wordsCount = innerWords.length;
    phrase = innerWords.join(' ');

    if (wordsCount > 0) {
      let firstWordResult = fuseEngine.search(innerWords[0]);
      firstWordResult.forEach(resItem => {
        let num = resItem.p;
        let tempPhrase = '';

        for (let i = 0; i < wordsCount; i++) {
          const nextWord = transcript[num];
          if (!nextWord) break;

          let space = (i !== 0) ? ' ' : '';
          if (nextWord.m === 'punc') {
            space = '';
            i--;
          }

          tempPhrase += space + replaceAndTrim(nextWord.w).toLowerCase();

          let partOfPhrase = innerWords.slice(0, i + 1);
          partOfPhrase = partOfPhrase.join(' ');
          if (partOfPhrase !== tempPhrase.trim() && transcript[num + 1] && transcript[num + 1].m !== 'punc') {
            break;
          }
          num++;
        }

        let isMatch = (tempPhrase.indexOf(phrase) !== -1);
        if (isMatch) {
          if (!result[phrase]) {
            result[phrase] = [];
          }
          result[phrase].push({
            time: resItem.s / 1000,
            keywordName: phrase
          });
        }
      });
    }
  });

  console.timeEnd('indexOf');
  return result;
};

export const splitPhrase = function (phrase) {
  phrase = phrase.toLocaleLowerCase().replace(/"/g, '');
  phrase = replaceAndTrim(phrase);
  let phraseWords = phrase.split(/(?=\W)(?=\s)/);
  let inner_words = [];
  phraseWords.forEach(word => {
    word = replaceAndTrim(word);
    if (word !== '') {
      inner_words.push(word);
    }
  });
  return inner_words;
};

export const searchWords = function (words, fuseEngine) {
  console.time('fuse');
  let result = {};

  words.forEach(word => {
    let res = fuseEngine.search(word);
    res = res.map(resItem => {
      return {
        time: resItem.s / 1000,
        keywordName: resItem.w
      }
    });
    result[word] = res;
  });

  console.timeEnd('fuse');
  return result;
};

export const createEngine = function (transcript, keys) {
  return new Fuse(transcript, {
    keys: keys,
    threshold: 0.2
  });
};

export const searchStringToTerms = function (searchString) {
  return searchString.match(/("[^"]+")+|[\S]+/ig);
};

export const parseTerms = function (terms) {
  let phrases = [];
  let words = [];

  terms.forEach(term => {
    if (term.indexOf('"') === 0 && term.lastIndexOf('"') === (term.length - 1)) { // if "many words"
      phrases.push(term);
    }
    else {
      words.push(term);
    }
  });

  return {phrases, words};
};

export const replaceAndTrim = function (word) {
  return word
    .replace(/<br\s*[\/]?>/gi, '')
    .replace(/\n/gi, '')
    .trim();
};

export const searchResultsToMarkers = function (searchResults) {
  let results = [];
  Object.keys(searchResults).forEach((term, i) => {
    let color = COLORS[i] ? COLORS[i] : getRandomColor();
    let markers = searchResults[term].map(item => Object.assign({}, item, {color}));
    results = results.concat(markers);
  });
  return results;
};
