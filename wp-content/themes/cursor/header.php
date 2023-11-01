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
    <div class="l-search-wrap">
      <div class="l-region l-region--search-bar">
        <div class="block block--search global-search block--search-form" id="block-search-form" role="search">
          <div class="block__content">
            <form accept-charset="UTF-8" action="index.html" class="search-block-form" id="search-block-form" method="post">
              <div>
                <div class="container-inline">
                  <h2 class="element-invisible">Search form</h2>
                  <div class="form-item form-type-textfield form-item-search-block-form">
                    <label class="element-invisible" for="edit-search-block-form--2">Search </label>
                    <input class="form-text" id="edit-search-block-form--2" maxlength="128" name="search_block_form" size="15" title="Enter the terms you wish to search for." type="text" value="" />
                  </div>
                  <div class="form-actions form-wrapper" id="edit-actions"><input class="form-submit" id="edit-submit" name="op" type="submit" value="Search" /></div><input name="form_build_id" type="hidden" value="form-dzbLHZy0fxFxSqXKtcHk5i5eRqeIV-RJQRvg6Uai-lM" />
                  <input name="form_id" type="hidden" value="search_block_form" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <nav class="block block--menu-block mobile-nav block--menu-block-5" id="block-menu-block-5" role="navigation">

          <div class="menu-block-wrapper menu-block-5 menu-name-main-menu parent-mlid-0 menu-level-1">
            <ul class="menu">
              <li class="first expanded menu-mlid-994"><a href="understand-gambling">Understand Gambling</a>
                <ul class="menu">
                  <li class="first leaf menu-mlid-1037"><a href="understand-gambling/how-pokies-work">How pokies work</a></li>
                  <li class="leaf menu-mlid-1673"><a href="understand-gambling/online-gambling">Online gambling</a></li>
                  <li class="leaf menu-mlid-1674"><a href="understand-gambling/guide-to-casino-games">Guide to casino games</a></li>
                  <li class="leaf menu-mlid-1696"><a href="understand-gambling/how-lotto-works">How Lotto works</a></li>
                  <li class="leaf menu-mlid-995"><a href="understand-gambling/know-your-odds">Know your odds</a></li>
                  <li class="leaf menu-mlid-1675"><a href="understand-gambling/gaming-vs-gambling">Gaming vs Gambling</a></li>
                  <li class="last leaf menu-mlid-1446"><a href="how-much-is-too-much/test-your-gambling" title="">Test your gambling</a></li>
                </ul>
              </li>
              <li class="expanded menu-mlid-998"><a href="how-much-is-too-much">How much is too much?</a>
                <ul class="menu">
                  <li class="first leaf menu-mlid-1050"><a href="how-much-is-too-much/know-the-signs">Know the signs</a></li>
                  <li class="leaf menu-mlid-1051"><a href="how-much-is-too-much/how-much-are-you-spending">How much are you spending?</a></li>
                  <li class="leaf has-children menu-mlid-993"><a href="how-much-is-too-much/real-life-stories">Real life stories</a></li>
                  <li class="last leaf menu-mlid-1024"><a href="how-much-is-too-much/test-your-gambling">Test your gambling</a></li>
                </ul>
              </li>
              <li class="expanded menu-mlid-999"><a href="controlling-gambling">Controlling gambling</a>
                <ul class="menu">
                  <li class="first leaf menu-mlid-1061"><a href="controlling-gambling/ways-to-control-your-gambling">Staying in control</a></li>
                  <li class="leaf menu-mlid-1028"><a href="controlling-gambling/sharing-and-talking">Sharing and talking</a></li>
                  <li class="leaf menu-mlid-1045"><a href="activities-overview">Keeping busy</a></li>
                  <li class="last leaf menu-mlid-1447"><a href="how-much-is-too-much/test-your-gambling" title="">Test your gambling</a></li>
                </ul>
              </li>
              <li class="expanded menu-mlid-1000"><a href="concerned-for-someone">Concerned for someone?</a>
                <ul class="menu">
                  <li class="first leaf menu-mlid-1057"><a href="concerned-for-someone/what-you-should-know">What you should know</a></li>
                  <li class="leaf menu-mlid-1059"><a href="concerned-for-someone/talking-to-them">Talking to them</a></li>
                  <li class="leaf menu-mlid-1060"><a href="concerned-for-someone/tips-for-helping-others">Tips for helping others</a></li>
                  <li class="last leaf menu-mlid-1145"><a href="concerned-for-someone/test-someone-elses-gambling">Test someone else's gambling</a></li>
                </ul>
              </li>
              <li class="last expanded menu-mlid-1053"><a href="help-support">Help &amp; support</a>
                <ul class="menu">
                  <li class="first leaf menu-mlid-1055"><a href="help-support/face-to-face-support">Face to face support</a></li>
                  <li class="leaf menu-mlid-1054"><a href="help-support/cultural-support">Cultural support</a></li>
                  <li class="last leaf menu-mlid-1329"><a href="help-support/services-near-you-0">Services near you</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <div class="l-main-wrap">