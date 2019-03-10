const { yearFromUrl } = require('./filters');
module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addFilter('yearFromUrl', yearFromUrl);
};
