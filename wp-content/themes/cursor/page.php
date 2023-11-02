<?
get_header();
?>
<div class="l-page has-no-sidebars">
	<div class="l-main-wrap">
		<?php
		while (have_posts()) :
			the_post();
		?>
		<?php
			the_content();

		endwhile; // End of the loop.
		?>

	</div>
</div>

<?php
get_footer();


