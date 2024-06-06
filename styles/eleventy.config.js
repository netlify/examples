const sass = require("sass");

module.exports = function(eleventyConfig) {

  // pass through the assets
  eleventyConfig.addPassthroughCopy({"public/": "/"});

  // Sass pipeline
  eleventyConfig.addTemplateFormats("scss ,css");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function(contents, includePath) {
      let includePaths = [this.config.dir.includes];
      return () => {
        let ret = sass.renderSync({
          file: includePath,
          includePaths,
          data: contents,
          outputStyle: "compressed"
        });
        return ret.css.toString("utf8");
      }
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  }
};



