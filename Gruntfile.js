// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.grunt_name)
    pkg: grunt.file.readJSON('package.json'),
	
	banner: '/*!\n' +
            ' * Propeller v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2018-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under MIT (http://github.com/WaladJS/LICENSE)\n' +
            ' */\n',
	
	// Task configuration.
	clean: {
      dist: 'dist',
	  archive: 'archive',
	  assets: ['assets/css/Walad.css', 'assets/css/Walad.min.css' , 'assets/js/Walad.js', 'assets/js/Walad.min.js'],
    },
	concat: {
      options: {
        stripBanners: false
      },
      waladjs: {
		src: [
			'components/textfield/js/textfield.js',
			'components/checkbox/js/checkbox.js',
			'components/radio/js/radio.js',
			'components/button/js/ripple-effect.js',
			'components/dropdown/js/dropdown.js',
			'components/accordion/js/accordion.js',
			'components/alert/js/alert.js',
			'components/popover/js/popover.js',
			'components/tab/js/tab-scrollable.js',
			'components/sidebar/js/sidebar.js'
		],
		dest: 'assets/dist/js/<%= pkg.grunt_name %>.js'
      },
      WaladCss: {
		src: [
			'assets/css/Walad-roboto.css',
			'components/typography/css/typography.css',
			'components/icons/css/google-icons.css',
			'components/card/css/card.css',
			'components/accordion/css/accordion.css',
			'components/alert/css/alert.css',
			'components/badge/css/badge.css',
			'components/button/css/button.css',
			'components/modal/css/modal.css',
			'components/dropdown/css/dropdown.css',
			'components/textfield/css/textfield.css',
			'components/checkbox/css/checkbox.css',
			'components/radio/css/radio.css',
			'components/toggle-switch/css/toggle-switch.css',
			'components/list/css/list.css',
			'components/navbar/css/navbar.css',
			'components/popover/css/popover.css',
			'components/progressbar/css/progressbar.css',
			'components/sidebar/css/sidebar.css',
			'components/tab/css/tab.css',
			'components/table/css/table.css',
			'components/tooltip/css/tooltip.css',
			'components/floating-action-button/css/floating-action-button.css',
			'components/utilities/css/utilities.css'
		],
		dest: 'assets/dist/css/<%= pkg.grunt_name %>.css'
      }
    },
	jshint: {
      options: {
        jshintrc: 'grunt/.jshintrc'
      },
      core: {
		src: '<%= concat.waladJs.src %>',  
      }
    },  
	autoprefixer: {
		options: {
		  browsers: ['last 2 versions', 'ie 9']
		},
		dist: {
			files: {
				'assets/dist/css/Walad.css': 'assets/dist/css/Walad.css',
				'assets/dist/css/Walad.min.css': 'assets/dist/css/Walad.min.css'
			}
		}
	},
	csslint: {
	  options: {
		csslintrc: 'grunt/.csslintrc'
	  },	
	  strict: {
		options: {
		  import: false
		},
		src: ['<%= concat.WaladCss.src %>']
	  }
	},
	watch: {
		styles: {
			files: ['<%= concat.WaladCss.src %>'],
			tasks: ['autoprefixer']
		}
    },
	cssmin: {
      options: {
  	    compatibility: 'ie8',
        keepSpecialComments: 0,
        sourceMap: true,
        advanced: false
      },
	  WaladMinCss: {
	    src: '<%= concat.WaladCss.dest %>',
        dest: 'assets/dist/css/<%= pkg.grunt_name %>.min.css'
      }
    },
	babel: {
        options: {
            sourceMap: true,
            presets: ['babel-preset-es2015']
        },
        dist: {
            files: {
			  '<%= concat.waladjs.dest %>' : '<%= concat.waladjs.dest %>'
			}
        }
    },
	uglify: {
      WaladMinJs: {
		  options: {
			banner: '<%= banner %>',  
			compress: {
			  warnings: false
			},
			mangle: true,
			preserveComments:'some'
		  },
		src: '<%= concat.waladjs.dest %>',
        dest: 'assets/dist/js/<%= pkg.grunt_name %>.min.js'
		
      }
    },  
	stamp: {
		yourTarget: {
			options: {
				banner: '<%= banner %>',
			},	
			files: {
				src: '<%= cssmin.WaladMinCss.dest %>'
			}
		}
	},
	csscomb: {
      options: {
        config: 'grunt/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'assets/dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'assets/dist/css/'
      }
    },
	copy: {
      fonts: {
	    expand: true,
		cwd: 'assets/fonts/',
		src: '**',
		dest: 'assets/dist/fonts/',
	  },
	  cssjs: {
	    expand: true,
		cwd: 'assets/dist/',
		src: ['**', '!fonts/**'],
		dest: 'assets/'
	  },
	  core: {
		expand: true,
		src: [
			'components/**/*',
			'assets/**/*',
			'!components/*/snippets/**',
			'!assets/landing-page/**',
		],
		dest: 'archive/jmd-admin-template-<%= pkg.version %>/'
	   },
	   admintemplate: {
			expand: true,
			cwd: 'templates/admin-dashboard/', 
			src: ['**'], 
			dest: 'archive/jmd-admin-template-<%= pkg.version %>/',
	  }
	},
	processhtml: {
	  dist:{
		options: {
		  process: true,
		},
		files: [
		{
		  expand: true,
		  cwd: 'archive/jmd-admin-template-1.1.0/',
		  src: ['*.html'],
		  dest: 'archive/jmd-admin-template-1.1.0/',
		  ext: '.html'
		},
		],
	  }
	},
	compress: {
      distzip: {
        options: {
          archive: 'archive/jmd-<%= pkg.version %>-dist.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'assets/dist/',
            src: ['**'],
            dest: 'jmd-<%= pkg.version %>-dist'
          }
        ]
      },
	  main: {
        options: {
          archive: 'archive/jmd-<%= pkg.version %>.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
            src: [
				'components/**/*',
				'!components/*/snippets/**',
				'assets/**/*',
				'!assets/landing-page/**',
				'assets/dist/**/*',
				'templates/**/*'
			],
            dest: '/'
          }
        ]
      },
	  admin: {
        options: {
          archive: 'archive/jmd-admin-template-<%= pkg.version %>.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
			cwd: 'archive/jmd-admin-template-<%= pkg.version %>',
            src: ['**'],
            dest: 'jmd-admin-template-<%= pkg.version %>'
          }
        ]
      }
    },
  });
  
  // Project configuration.
  grunt.util.linefeed = '\n';
  
  // this default task will go through all configuration (dev and production) in each task 
  grunt.registerTask('default', ['clean', 'concat', 'autoprefixer', 'csslint', 'babel', 'uglify', 'jshint', 'cssmin', 'csscomb', 'stamp', 'copy', 'processhtml', 'compress']);

  // this task will only run for JS and CSS
  grunt.registerTask('jscss', ['clean', 'concat', 'babel', 'uglify', 'jshint', 'concat_css', 'cssmin']);
  
  grunt.registerTask('compress', ['copy', 'processhtml', 'compress']);
  
  grunt.registerTask('admintemplate', ['copy', 'processhtml']);

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-stripcomments');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-stamp');
};
