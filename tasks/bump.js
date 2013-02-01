/*
 * Increase version number
 *
 * grunt bump
 * grunt bump:patch
 * grunt bump:minor
 * grunt bump:major
 *
 * @author Vojta Jina <vojta.jina@gmail.com>
 * @author Mathias Paumgarten <mail@mathias-paumgarten.com>
 */

module.exports = function(grunt) {
  grunt.registerTask('bump', 'Increment the version number.', function(versionType) {
    var PACKAGE_FILE = 'package.json';
    var _package = grunt.file.readJSON(PACKAGE_FILE);
    var file = grunt.file.read( PACKAGE_FILE );
    var buildRe = /([\'|\"]build[\'|\"]:\s*[\'|\"])(\d*)([\'|\"])/i,
        versionRe = /((\s*)[\'|\"]version[\'|\"]:[ ]*[\'|\"])([\d|.]*)([\'|\"])/i;

    // compute the new version
    var version = bumpVersion(_package.version, versionType || 'patch'),
        build = bumpBuild(_package.build),
        str = file.match(versionRe)[0];

    file = file.replace(versionRe, function( match, left, indent, center, right ) {
      var str = left + version + right;
      if (!file.match(buildRe)) {
        str += "," + indent + '"build": "0"';
      }
      return str;
    });

    file = file.replace(buildRe, function( match, left, center, right ) {
      return left + build + right;
    });

    grunt.file.write( PACKAGE_FILE, file );

    grunt.log.ok('At version ' + version + ':' + build);
  });


  function bumpVersion (version, versionType) {
    var type = {
      patch: 2,
      minor: 1,
      major: 0,
      build: false
    };

    var parts = version.split('.');
    var idx = type[versionType || 'patch'];

    if (idx !== false) {
      parts[idx] = parseInt(parts[idx], 10) + 1;
      while(++idx < parts.length) {
        parts[idx] = 0;
      }
    }
    return parts.join('.');
  }

  function bumpBuild (build) {
    if (build) {
      build = parseInt(build, 10) + 1;
    }
    else {
      build = 1;
    }

    return build;
  }
};
