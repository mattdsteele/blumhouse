module.exports.yearFromUrl = slug => {
  return /likes\/(.*)\//.exec(slug)[1];
};
