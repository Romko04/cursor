<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package cursor
 */

get_header();
?>
<div class="l-page has-no-sidebars">
	<div class="l-main-wrap">
		<div class="l-region l-region--content-before">
			<nav id="block-menu-block-4" role="navigation" class="block block--menu-block secondary-nav block--menu-block-4">
				<div class="menu-block-wrapper menu-block-4 menu-name-main-menu parent-mlid-0 menu-level-2">
					<?php
					$taxonomy_name = 'understand-gambling'; // Замініть 'taxonomy_name' на актуальну назву вашої таксономії.
					$taxonomies = get_terms(array(
						'taxonomy' => $taxonomy_name,
						'hide_empty' => false
					));
					$current_url = home_url(add_query_arg(array(), $wp->request)); // Отримуємо поточний URL
					?>

					<ul class="menu">
						<?php foreach ($taxonomies as $term) :
							$term_url = get_term_link($term);
							// Додаємо слеш до URL перед порівнянням
							$term_url_with_slash = trailingslashit($term_url);
							$current_url_with_slash = trailingslashit($current_url);
							$currentTaxonomy = ($current_url_with_slash === $term_url_with_slash) ? 'active' : '';
							echo '<li class="' . $currentTaxonomy . '"><a href="' . $term_url . '">' . $term->name . '</a></li>';
						endforeach;
						?>
					</ul>
				</div>
			</nav>
		</div>
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
