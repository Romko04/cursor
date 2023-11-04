<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package cursor
 */

?>

</div>
<footer class="l-footer" role="contentinfo">
	<div class="l-region l-region--footer">
		<nav class="block block--menu-block block--menu-block-3" id="block-menu-block-3" role="navigation">

			<div class="menu-block-wrapper menu-block-3 menu-name-menu-footer-menu parent-mlid-0 menu-level-1">
			<?php
              wp_nav_menu(
                array(
                  'theme_location' => 'menu-2',
                  'menu_class' => 'menu',
                  'menu_id' => 'nav',
                  'container'=> ''
                )
              );
              ?>
			</div>
		</nav>
		<div class="block block--block hpa-logo block--block-5" id="block-block-5">
			<div class="block__content">
			<?php $logo_footer = get_field('footer__logo'); ?>
				<a href="http://www.smokefree.org.nz/" rel="external" target="_blank" title="Visit the Homepage | Health Promotion Agency’s Smokefree website">
					<img src="<?php the_field('footer__logo', 'options'); ?>" alt="">
				</a>
			</div>
		</div>
		<a class="chat-button mobile--not-fixed" href="#" onclick="OpenChatBox()">Click here to chat with us</a>
	</div>
</footer>

&nbsp;

<?php wp_footer(); ?>

</body>

</html>