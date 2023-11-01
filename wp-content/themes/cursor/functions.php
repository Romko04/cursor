<?php
/**
 * cursor functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package cursor
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function cursor_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on cursor, use a find and replace
		* to change 'cursor' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'cursor', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Heder Navigation', 'cursor' ),
			'menu-2' => esc_html__( 'Footer Navigation', 'cursor' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'cursor_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support('custom-logo',);
}
add_action( 'after_setup_theme', 'cursor_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function cursor_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'cursor_content_width', 640 );
}
add_action( 'after_setup_theme', 'cursor_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function cursor_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'cursor' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'cursor' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'cursor_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function cursor_scripts() {

	wp_enqueue_style( 'wayup-style', get_stylesheet_uri());
	wp_enqueue_style( 'wayup-main-index', get_template_directory_uri().'/assets/sites/default/files/advagg_css/css__uN-D1kx-ubV0vj8nO3ku3AYevlMW5IyKbon7rcaoTYo__u3eNNL-C4x4sYoxq5jAAbCZSBG2wTgknZO34XtqJUYU__WsQApc0zMW1GPZj5WpNt4HD5z4HA5BDYZsBlksmV4uA.css',array(),'1.0');
	wp_enqueue_style( 'wayup-main-index2', get_template_directory_uri().'/assets/sites/default/files/advagg_css/css__zvKG_aGfA2PDx_OxPHWuZ72qJCw6JMfThivmVuPhlnM__JXUKa0g6i3PFrzY4zXLMDzSdc5aVuDX0fLI5qzikY00__WsQApc0zMW1GPZj5WpNt4HD5z4HA5BDYZsBlksmV4uA.css',array(),'1.0');
	wp_enqueue_style( 'wayup-main-index3', get_template_directory_uri().'/assets/sites/default/files/advagg_css/sites/default/files/advagg_css/css__uVktGZVyPNtGB3nRfULy1JSVAQ9UgXhd7naIbG1Do-0__2BquaIyb4TP8Wd4bDI5TgbJsG9XSaELJ4eyI2h8VvZw__WsQApc0zMW1GPZj5WpNt4HD5z4HA5BDYZsBlksmV4uA.css',array(),'1.0');


	wp_enqueue_script( 'cursor-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'cursor-scripts-1', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/script-1.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'cursor-scripts-2', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/script-2.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'cursor-scripts-3', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/script-3.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'cursor-scripts-4', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/script-4.js', array(), _S_VERSION, true );



	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'cursor_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}
add_filter( 'upload_mimes', 'svg_upload_allow' );

# Добавляет SVG в список разрешенных для загрузки файлов.
function svg_upload_allow( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';

	return $mimes;
}
add_filter( 'wp_check_filetype_and_ext', 'fix_svg_mime_type', 10, 5 );

# Исправление MIME типа для SVG файлов.
function fix_svg_mime_type( $data, $file, $filename, $mimes, $real_mime = '' ){

	// WP 5.1 +
	if( version_compare( $GLOBALS['wp_version'], '5.1.0', '>=' ) ){
		$dosvg = in_array( $real_mime, [ 'image/svg', 'image/svg+xml' ] );
	}
	else {
		$dosvg = ( '.svg' === strtolower( substr( $filename, -4 ) ) );
	}

	// mime тип был обнулен, поправим его
	// а также проверим право пользователя
	if( $dosvg ){

		// разрешим
		if( current_user_can('manage_options') ){

			$data['ext']  = 'svg';
			$data['type'] = 'image/svg+xml';
		}
		// запретим
		else {
			$data['ext']  = false;
			$data['type'] = false;
		}

	}

	return $data;
}