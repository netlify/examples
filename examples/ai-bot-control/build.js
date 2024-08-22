/*
  You might have a framework or other tool to build you site.
  For this example, we're keeping it simple and not pushing you
  towards any framework in particular. 
  
  Anything that can build files from some data will do what you need.
*/

// We'll be writing a file, so we'll need this. 
const fs = require('fs');


// Source a list of know User Agent strings used by AI crawlers.
const agents = require('./agents.json');

// Generate a robots.txt file to disallow all known crawlers
let rules = [];
agents.forEach(ua => {
  rules.push(`User-agent: ${ua}\nDisallow: /`);
});
fs.writeFile('./www/robots.txt', rules.join("\n\n"), err => {
  if (err) {
    console.error(err);
  } else {
    console.log("robots.txt file generated");
  }
});


