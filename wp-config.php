<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'cursor_bd' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'C-qeF6*|a3e)FqVRUEU|hCV}3pOH}9;K+&5@g.$e`Yk.3v9oPY<;A.7?NQ&0pMaq' );
define( 'SECURE_AUTH_KEY',  '`xx:y#RR~*75hiX$y +-?~=S_e4(fBY9;~B^-5Z%F|>E}F)2z(VybNl,]t?9A%iW' );
define( 'LOGGED_IN_KEY',    '+ji6pAB.FOKRd#@6$`]tl)%Q#z@,GsSRc%2#:vJJ:aF+2Y8ZRne}Y8G|+]~bgr *' );
define( 'NONCE_KEY',        'UoTVa=7E]khKX?D$+:zmMI)Q4%Q?55PJMtg5]_#};qzo[|/<*2s&J-qIsrj|6Q#m' );
define( 'AUTH_SALT',        'RFixZ`dIk_}U~-R9WWk{FZfFM-~]4qD>Oroa^Xs]LUzz96`K0}]18w}z^5nEpC+J' );
define( 'SECURE_AUTH_SALT', '{#gZ=fDjx2kO{ofBB]z/yLZ/_b)JO=vrPj6CxeOc@:}L^.^<~M{]{ZG?Yh]4O(:8' );
define( 'LOGGED_IN_SALT',   ' ;o]m%Dl3-o@VY_%&xd%$[QtA|^voRk^N(Lq{H+;`_a2ce[Ki]w:vr=E+MaEzrMR' );
define( 'NONCE_SALT',       '#FS(O8uIDDi^pJ!]@L&$;j{k;5<0&vd6[HS>5^[#n2DWAyu] ]gi,9h;Wppu:A5`' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
