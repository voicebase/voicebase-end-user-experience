import { parseReactSelectValues } from './Common'

export const parseVocabularyFile = function (file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      let parsedResult = [];
      let lines = reader.result.split('\n');
      lines.forEach((line) => {
        line = line.trim();
        if (line) {
          parsedResult.push(line);
        }
      });

      let result = [].concat(parsedResult);
      resolve(result);
    };

    reader.readAsText(file);
  });
};

export const parseVocabulary = function (vocabulary) {
  return new Promise((resolve) => {
    const files = vocabulary.termsFiles || [];
    const promises = files.map((file) => parseVocabularyFile(file));
    Promise.all(promises)
      .then((parsedFiles) => {
        let terms = parseReactSelectValues(vocabulary.terms);
        parsedFiles.forEach((file) => {
          terms = terms.concat(file);
        });
        vocabulary.terms = terms;
        resolve(vocabulary);
      });
  });
};
