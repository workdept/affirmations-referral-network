var path = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('writecnamefile', "Write the CNAME file for GitHub pages", function() {
    filename = path.join(this.data.dir, 'CNAME');    
    grunt.file.write(filename, this.data.domain);
  });
};

