module.exports = function(grunt) {
  var distDir = 'dist';

  grunt.initConfig({
    clean: {
      project: [
        'dist/*.html',
        'dist/about',
        'dist/contact',
        'dist/css',
        'dist/js',
        'dist/data'
      ]
    },

    assemble: {
      options: {
        flatten: true,
        assets: 'dist',
        data:   ['src/data/*.json', 'src/data/*.yml'],

        layoutdir: 'src/templates/layouts',
        layout: 'default.hbs',
        partials: 'src/templates/partials/*.hbs',

        plugins: ['assemble-contrib-permalinks'],

        baseUrl: grunt.option('baseurl') || ''
      },
      pages: {
        options: {
          permalinks: {
            structure: ':basename/index.html'
          }
        },
        files: [
          {
            expand: true,
            cwd: 'src/templates/',
            src: '*.hbs',
            dest: 'dist',
            ext: '.html'
          }
        ]
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
            dest: 'dist' 
          }
        ]
      },

      bower: {
        files: [
          {
            src: 'bower_components/lunr.js/lunr.min.js',
            dest: 'dist/js/lunr-0.4.5.min.js'
          }
        ]
      },

      data: {
        files: [
          {
            expand: true,
            cwd: 'src/data/',
            src: ['**'], 
            dest: 'dist/data'
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
        'src/data/*',
        'src/assets/css/*',
        'src/assets/js/*'
      ],
      tasks: ['newer:assemble', 'copy']
    },

    bakeproviders: {
      project: {
        spreadsheetId: '1eU0mrtMWv7MQnqu-n4zG4V5Dr5toN2r7diM3sz6hdQU',
        output: 'src/data/providers.json'
      }
    },

    writecnamefile: {
      project: {
        dir: distDir,
        domain: 'health.goaffirmations.org'
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'https://github.com/workdept/affirmations-referral-network.git',
          branch: 'gh-pages'
        }
      },
      travis: {
        options: {
          remote: 'https://' + process.env.GH_TOKEN + '@' + 'workdept/affirmations-referral-network.git',
          branch: 'gh-pages'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-build-control');
  grunt.loadTasks('./tasks');
  grunt.registerTask('default', ['assemble', 'copy']);
  grunt.registerTask('predeploy', ['assemble', 'copy', 'writecnamefile']);
  grunt.registerTask('deploy', ['predeploy', 'buildcontrol:pages']);
  grunt.registerTask('deploytravis', ['predeploy', 'buildcontrol:travis']);
};
