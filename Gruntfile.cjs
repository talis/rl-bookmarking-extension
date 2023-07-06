module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    distdir: './dist',
    copy: {
      dependencies: {
        files: [
          {
            expand: true,
            cwd: './node_modules',
            src: [
              'bootstrap/dist/js/bootstrap.min.js',
              'bootstrap/dist/css/bootstrap.min.css',
              'jquery/dist/jquery.min.js'
            ],
            dest: 'dist/dependencies'
          },
        ]
      },
      common: {
        files: [
          {
            expand: true,
            cwd: './',
            src: [
              '*.html',
              'background.js',
              '_locales/**',
              'images/**',
              'css/**',
              'js/*.js',
              '!js/ms'
            ],
            dest: 'dist'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('create-dist-dir', 'Creates the dist directory', function () {
    grunt.file.delete(grunt.config('distdir'));
    grunt.file.mkdir(grunt.config('distdir'));
  });
  grunt.registerTask('write-manifest', 'Writes the manifest file to dist', function (dist) {
    var manifest = grunt.file.readJSON('manifest.json');
    manifest.version = grunt.config('pkg.version');
    if (grunt.option('identifier')) {
      manifest.applications = { 'gecko': { 'id': grunt.option('identifier') } };
      delete manifest.options_page;
      delete manifest.options_ui.chrome_style;
      manifest.options_ui.browser_style = true;
    }
    if (dist === 'manifold') {
      // manifoldjs requires a completely different icons schema for packaging edge extensions
      manifest.icons = [
        {"sizes":"16x16", "src": "images/icon16.png"},
        {"sizes": "30x30", "src": "images/icon30.png"},
        {"sizes": "50x50", "src": "images/icon50.png"},
        {"sizes":"120x120", "src": "images/icon120.png"},
        {"sizes":"176x176", "src": "images/icon176.png"},
      ];
      manifest.permissions[0] = "tab";
      manifest.permissions.push("*://*/*");
      manifest.start_url = '';
      manifest.scope = '/';
    }
    grunt.file.write(grunt.config('distdir') + '/manifest.json', JSON.stringify(manifest, null, 2));
  });
  grunt.registerTask(
    'dist-common',
    'Create distribution for Web Extension browsers',
    ['create-dist-dir', 'write-manifest:common', 'copy:dependencies', 'copy:common']
  );
  grunt.registerTask(
    'dist-manifold',
    'Create distribution for Web Extension browsers',
    ['create-dist-dir', 'write-manifest:manifold', 'copy:dependencies', 'copy:common']
  );
  grunt.registerTask('default', ['dist-common']);
};
