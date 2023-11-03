<?php get_header(); ?>
<div class="l-page has-no-sidebars">
	<div class="l-main-wrap">
		<div class="l-region l-region--content-before">
			<nav id="block-menu-block-4" role="navigation" class="block block--menu-block secondary-nav block--menu-block-4">
				<div class="menu-block-wrapper menu-block-4 menu-name-main-menu parent-mlid-0 menu-level-2">
					<ul class="menu">
						<?php
						$services = new WP_Query(array(
							'post_type' => get_post_type(),
							'posts_per_page' => -1,
						));
						$current_url = home_url(add_query_arg(array(), $wp->request));
						$current_item = '';
						if ($services->have_posts()) :
							while ($services->have_posts()) : $services->the_post();
								$current_item_link = get_permalink();
								if (trailingslashit($current_url)== trailingslashit($current_item_link)) {
									$current_item = 'active';
								} else{
									$current_item = '';
								}

						?>

								<li class="<?php echo $current_item ?>"><a href="<?php the_permalink() ?>"><?php the_title() ?></a></li>
						<?php endwhile;

							wp_reset_postdata();
						endif; ?>
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
<?php get_footer(); ?>