module.exports.yearFromUrl = slug => {
  return /\/(.*)\//.exec(slug)[1];
};
