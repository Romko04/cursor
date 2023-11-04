<div class="l-search-wrap">
  <div class="l-region l-region--search-bar">
    <div class="block block--search global-search block--search-form" id="block-search-form" role="search">
      <div class="block__content">
        <form accept-charset="UTF-8" role="search.php" action="<?php echo home_url("/"); ?>" class="search-block-form" id="search-block-form" method="post">
          <div>
            <div class="container-inline">
              <h2 class="element-invisible">Search form</h2>
              <div class="form-item form-type-textfield form-item-search-block-form">
                <label class="element-invisible" for="edit-search-block-form--2">Search </label>
                <input class="form-text" id="edit-search-block-form--2" maxlength="128" name="search_block_form" size="15" title="Enter the terms you wish to search for." type="text" value="<?php echo get_search_query(); ?>" />
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
        <?php
        wp_nav_menu(
          array(
            'theme_location' => 'menu-3',
            'menu_class' => 'menu',
            'menu_id' => 'nav',
            'container' => '',
            'link_after' => '<span class="expand"> </span>'
          )
        );
        ?>
      </div>
    </nav>
  </div>
</div>