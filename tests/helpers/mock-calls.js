// Shared helpers for reading arguments out of a vi.fn() mock's call history
// without reaching for Array.prototype.map in test files.

export const getFirstArgs = (mockFn) => {
  const firstArgs = [];
  for (let i = 0; i < mockFn.mock.calls.length; i++) {
    firstArgs.push(mockFn.mock.calls[i][0]);
  }
  return firstArgs;
};

export const getFirstArgField = (mockFn, fieldName) => {
  const values = [];
  for (let i = 0; i < mockFn.mock.calls.length; i++) {
    values.push(mockFn.mock.calls[i][0][fieldName]);
  }
  return values;
};
