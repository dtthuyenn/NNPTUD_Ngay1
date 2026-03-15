function evenOddArray(arr) {
  return arr.map(x => {
    if (typeof x !== 'number' || !Number.isFinite(x)) return null;
    if (!Number.isInteger(x)) return 'non-integer';
    return x % 2 === 0 ? 'even' : 'odd';
  });
}

// Example
const input = [1, 2, 3, 4, 0, -5, 2.5, 'a', 8];
console.log('input:', input);
console.log('result:', evenOddArray(input));

module.exports = { evenOddArray };