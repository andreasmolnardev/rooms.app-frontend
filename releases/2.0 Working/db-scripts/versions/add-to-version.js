export function addToVersion(versionNumber) {
    const versionNumberSplit = versionNumber.split('.').map(Number);
    const newPossibleVersionNumbers = [];
  
    for (let i = versionNumberSplit.length - 1; i >= 0; i--) {
      const incrementedVersion = [...versionNumberSplit];
  
      if (isNaN(incrementedVersion[i])) {
        incrementedVersion[i] = 1;
      } else {
        incrementedVersion[i]++;
      }
  
      for (let j = i + 1; j < incrementedVersion.length; j++) {
        incrementedVersion[j] = 0;
      }
  
      newPossibleVersionNumbers.push(incrementedVersion.join('.'));
    }
  
    return newPossibleVersionNumbers;
  }
  