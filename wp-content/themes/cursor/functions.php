<?php

/**
 * cursor functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package cursor
 */

if (!defined('_S_VERSION')) {
	// Replace the version number of the theme on each release.
	define('_S_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function cursor_setup()
{
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on cursor, use a find and replace
		* to change 'cursor' to the name of your theme in all the template files.
		*/
	load_theme_textdomain('cursor', get_template_directory() . '/languages');

	// Add default posts and comments RSS feed links to head.
	add_theme_support('automatic-feed-links');

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support('title-tag');

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support('post-thumbnails');

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__('Heder Navigation', 'cursor'),
			'menu-2' => esc_html__('Footer Navigation', 'cursor'),
			'menu-3' => esc_html__('Header Navigation-mob', 'cursor'),
			
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
	add_theme_support('customize-selective-refresh-widgets');

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support('custom-logo',);
}
add_action('after_setup_theme', 'cursor_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function cursor_content_width()
{
	$GLOBALS['content_width'] = apply_filters('cursor_content_width', 640);
}
add_action('after_setup_theme', 'cursor_content_width', 0);

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function cursor_widgets_init()
{
	register_sidebar(
		array(
			'name'          => esc_html__('Sidebar', 'cursor'),
			'id'            => 'sidebar-1',
			'description'   => esc_html__('Add widgets here.', 'cursor'),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action('widgets_init', 'cursor_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function cursor_scripts()
{

	wp_enqueue_style('wayup-main-index', get_template_directory_uri() . '/assets/sites/default/files/advagg_css/css__uN-D1kx-ubV0vj8nO3ku3AYevlMW5IyKbon7rcaoTYo__u3eNNL-C4x4sYoxq5jAAbCZSBG2wTgknZO34XtqJUYU__WsQApc0zMW1GPZj5WpNt4HD5z4HA5BDYZsBlksmV4uA.css', array(), '1.0');
	wp_enqueue_style('wayup-main-index2', get_template_directory_uri() . '/assets/sites/default/files/advagg_css/css__zvKG_aGfA2PDx_OxPHWuZ72qJCw6JMfThivmVuPhlnM__JXUKa0g6i3PFrzY4zXLMDzSdc5aVuDX0fLI5qzikY00__WsQApc0zMW1GPZj5WpNt4HD5z4HA5BDYZsBlksmV4uA.css', array(), '1.0');
	wp_enqueue_style('wayup-main-index3', get_template_directory_uri() . '/assets/sites/default/files/advagg_css/sites/default/files/advagg_css/css__uVktGZVyPNtGB3nRfULy1JSVAQ9UgXhd7naIbG1Do-0__2BquaIyb4TP8Wd4bDI5TgbJsG9XSaELJ4eyI2h8VvZw__WsQApc0zMW1GPZj5WpNt4HD5z4HA5BDYZsBlksmV4uA.css', array(), '1.0');
	wp_enqueue_style('wayup-style', get_stylesheet_uri());

	wp_enqueue_script('cursor-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true);
	wp_enqueue_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js', array(), '3.7.1', true);
	wp_enqueue_script('main-1.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js1.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-2.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js2.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-3.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js3.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-4.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js4.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-6.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js6.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-7.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js7.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-8.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js8.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-10.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js10.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-12.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js12.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-13.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js13.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-15.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js15.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-18.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js18.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-19.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js19.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-20.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js20.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-21.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js21.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-22.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js22.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-23.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js23.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-24.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js24.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-25.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js25.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-26.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js26.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-28.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js28.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-29.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js29.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-30.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js30.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-32.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js32.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-33.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js33.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-34.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js34.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-35.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js35.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-36.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js36.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-37.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js37.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-11.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js11.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-27.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js27.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-31.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js31.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-17.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js17.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-16.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js16.js', array(), _S_VERSION, true);

	wp_enqueue_script('main-9.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js9.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-14.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js14.js', array(), _S_VERSION, true);
	wp_enqueue_script('main-5.js', get_template_directory_uri() . '/assets/sites/default/files/advagg_js/js5.js', array(), _S_VERSION, true);









	if (is_singular() && comments_open() && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}
add_action('wp_enqueue_scripts', 'cursor_scripts');

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
if (defined('JETPACK__VERSION')) {
	require get_template_directory() . '/inc/jetpack.php';
}
add_filter('upload_mimes', 'svg_upload_allow');

# Добавляет SVG в список разрешенных для загрузки файлов.
function svg_upload_allow($mimes)
{
	$mimes['svg']  = 'image/svg+xml';

	return $mimes;
}
add_filter('wp_check_filetype_and_ext', 'fix_svg_mime_type', 10, 5);

# Исправление MIME типа для SVG файлов.
function fix_svg_mime_type($data, $file, $filename, $mimes, $real_mime = '')
{

	// WP 5.1 +
	if (version_compare($GLOBALS['wp_version'], '5.1.0', '>=')) {
		$dosvg = in_array($real_mime, ['image/svg', 'image/svg+xml']);
	} else {
		$dosvg = ('.svg' === strtolower(substr($filename, -4)));
	}

	// mime тип был обнулен, поправим его
	// а также проверим право пользователя
	if ($dosvg) {

		// разрешим
		if (current_user_can('manage_options')) {

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
function custom_submenu_class($classes, $args) {
    if ($args->theme_location === 'menu-3') {
        // Знаходимо індекс класу 'sub-menu' і замінюємо його на 'menu'
        $sub_menu_index = array_search('sub-menu', $classes);
        if ($sub_menu_index !== false) {
            $classes[$sub_menu_index] = 'menu';
        }
    }
    return $classes;
}

add_filter('nav_menu_submenu_css_class', 'custom_submenu_class', 10, 2);
if( function_exists('acf_add_options_page') ) {

    acf_add_options_page(array(
        'page_title'    => 'Theme General Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));

    acf_add_options_sub_page(array(
        'page_title'    => 'Theme Header Settings',
        'menu_title'    => 'Header',
        'parent_slug'   => 'theme-general-settings',
    ));

    acf_add_options_sub_page(array(
        'page_title'    => 'Theme Footer Settings',
        'menu_title'    => 'Footer',
        'parent_slug'   => 'theme-general-settings',
    ));

}