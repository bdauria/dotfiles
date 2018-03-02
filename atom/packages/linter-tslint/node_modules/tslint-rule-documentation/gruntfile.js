const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

const nodeModulesPath = path.resolve("node_modules");

module.exports = function(grunt) {
  function tsc(project, success) {
    child_process.spawn("node", [path.resolve(nodeModulesPath, "typescript/bin/tsc"), "-p", project]).on("close", (code) => {
      if (code < 0) {
        grunt.log.error("failed");
        success(false)
      }

      grunt.log.ok("done");
      success(true);
    });
  };

  function makeDir(dirName){
    try{
      fs.statSync(path.resolve(dirName));
    } catch (err) {
      if(err.code === "ENOENT") {
        fs.mkdirSync(path.resolve(dirName));
      } else {
        throw err;
      }
    }
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json")
  });

  grunt.registerTask("build", function () {
    const done = this.async();

    grunt.log.write("Copying plugins.json... ")
    try {
      makeDir("dist")
      fs.createReadStream(path.resolve("src/plugins.json")).pipe(fs.createWriteStream(path.resolve("dist/plugins.json")));

      makeDir("test_temp");
      makeDir("test_temp/src")
      fs.createReadStream(path.resolve("src/plugins.json")).pipe(fs.createWriteStream(path.resolve("test_temp/src/plugins.json")));
    } catch (err) {
      grunt.log.error(err);
      done(false);
    }
    grunt.log.ok("done");

    grunt.log.write("Compiling... ");
    tsc("src", (success) => {
      if (success) {
        tsc("spec", (success) => {
          if (success) {
            grunt.log.ok("done");
            done();
          } else {
            done(false);
          }
        });
      } else {
        done(false);
      }
    });
  });

  grunt.registerTask("jasmine", function () {
    const done = this.async();
    child_process.spawn("node", [path.resolve(nodeModulesPath, "jasmine/bin/jasmine.js")], {
      stdio: "inherit"
    }).on("close", (code) => {
      if (code) {
        grunt.log.error("failed");
        done(false);
      }

      grunt.log.ok("done");
      done();
    });
  });

  grunt.registerTask("test", ["build", "jasmine"]);
  grunt.registerTask("default", ["build"]);
};
