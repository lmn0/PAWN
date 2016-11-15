module.exports = function(grunt) {

	grunt.registerTask("update", function() {

		var pkg = require("../jsplumb/package.json"),
                    version = pkg.version,
	            fStub = "../jsplumb/dist/js/jsPlumb-" + version,
                    bowerJson = grunt.file.read("./bower.json"),
                    packageJson = grunt.file.read("./package.json");

		
		grunt.file.copy(fStub + ".js", "./jsplumb.js");
                grunt.file.copy(fStub + "-min.js", "./jsplumb.min.js");

                grunt.file.write("./bower.json", bowerJson.replace(/"version":[^,]+,/, "\"version\":\"" + version + "\","));
                grunt.file.write("./package.json", packageJson.replace(/"version":[^,]+,/, "\"version\":\"" + version + "\",")); 
	});

};
