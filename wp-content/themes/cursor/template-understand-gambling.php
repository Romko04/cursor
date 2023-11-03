<?php
/*
Template name: Understand-gambling page
 */
?>

<div class="l-page has-no-sidebars">
    <?php
    get_header();
    ?>
    <div class="l-main-wrap">
        <div class="l-region l-region--content-before">
            <nav id="block-menu-block-4" role="navigation" class="block block--menu-block secondary-nav block--menu-block-4">
                <div class="menu-block-wrapper menu-block-4 menu-name-main-menu parent-mlid-0 menu-level-2">
                    <ul class="menu">
                        <?php
                        $posts = new WP_Query(array(
                            'post_type' => 'understand-gambling',
                            'posts_per_page' => -1,
                        ));

                        if ($posts->have_posts()) :

                            while ($posts->have_posts()) : $posts->the_post(); ?>
                                <li><a href="<?php the_permalink() ?>"><?php the_title() ?></a></li>
                        <?php endwhile;

                            wp_reset_postdata();
                        endif; ?>
                    </ul>
                </div>
            </nav>
        </div>


        <?php the_content() ?>
    </div>
</div>

<?php
get_footer();
?>
</div>