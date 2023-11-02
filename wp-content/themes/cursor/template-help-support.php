<?php
/*
Template name: help-support page
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
                    <?php
                    $taxonomy_name = 'help-support'; // Замініть 'taxonomy_name' на актуальну назву вашої таксономії.
                    $taxonomies = get_terms(array(
                        'taxonomy' => $taxonomy_name,
                        'hide_empty' => false
                    ));
                    ?>

                    <ul class="menu">
                        <?php foreach ($taxonomies as $term) :
                            echo '<li><a href="' . get_term_link($term) . '">' . $term->name . '</a></li>';
                        ?>
                        <?php endforeach; ?>
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