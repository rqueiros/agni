export function isConstant(obj) {
  console.log(obj);
    try {
      obj = ''
      return false
    } catch (error) {
      return true
    }
};
