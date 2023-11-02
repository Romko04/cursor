<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cursor
 */

?>
<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>

<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="profile" href="https://gmpg.org/xfn/11">

  <?php wp_head(); ?>
</head>
</head>

<body class="html front not-logged-in page-node page-node- page-node-15 node-type-page">
  <div class="l-page has-no-sidebars">
    <div class="l-header-wrap">
      <header class="l-header" role="banner">
        <div class="l-branding">

          <?php the_custom_logo() ?>


        </div>

        <div class="l-region l-region--header">
          <div class="block block--block follow block--block-31" id="block-block-31">
            <div class="block__content">
              <ul>
                <li class="facebook"><a href="https://www.facebook.com/ChoicenotChanceNZ" rel="external nofollow" target="_blank">Follow us on Facebook</a></li>
              </ul>
            </div>
          </div>
          <div class="block block--block search-trigger trigger block--block-8" id="block-block-8">
            <div class="block__content">
              <p><button>Search</button></p>
            </div>
          </div>
          <div class="block block--block mobile-nav-trigger trigger block--block-7" id="block-block-7">
            <div class="block__content">
              <p><button>Menu</button></p>
            </div>
          </div>
        </div>
        <div class="l-region l-region--navigation">
          <nav class="block block--menu-block global-nav block--menu-block-1" id="block-menu-block-1" role="navigation">
            <div class="menu-block-wrapper menu-block-1 menu-name-main-menu parent-mlid-0 menu-level-1">
              <?php
              wp_nav_menu(
                array(
                  'theme_location' => 'menu-1',
                  'menu_class' => 'menu',
                  'menu_id' => 'nav',
                  'container' => ''
                )
              );
              ?>
            </div>
          </nav>
        </div>
      </header>
    </div>
    <?php get_search_form() ?>

    <div class="l-main-wrap">