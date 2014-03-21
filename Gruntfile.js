module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      project: [
        '*.html',
        'css'
      ]
    },

    assemble: {
      options: {
        flatten: true,
        assets: '',
        data:   'src/data/*.json',

        layoutdir: 'src/templates/layouts',
        layout: 'default.hbs',
        partials: 'src/templates/partials/*.hbs'
      },
      project: {
        files: {
          '.': ['src/templates/*.hbs' ]
        }
      }
    },

    // Copy assets to dist directory
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/',
            src: ['**'],
            dest: __dirname 
          }
        ]
      }
    },

    watch: {
      files: [
        'src/templates/*.hbs',
        'src/templates/layouts/*.hbs',
        'src/templates/partials/*.hbs',
        'src/content/*.md', 
        'src/data/*'
      ],
      tasks: ['newer:assemble']
    },

    bakeproviders: {
      project: {
        spreadsheetId: '1eU0mrtMWv7MQnqu-n4zG4V5Dr5toN2r7diM3sz6hdQU',
        output: 'src/data/providers.json'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadTasks('./tasks');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['newer:assemble', 'copy']);
};
