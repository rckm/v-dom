export default (tagName, { attrs = {}, children = [] } = {}) => {
  // options destructured
  return {
    tagName,
    attrs,
    children
  };
};
