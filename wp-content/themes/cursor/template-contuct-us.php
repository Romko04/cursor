<?php
/*
Template name: Contuct us page
 */
?>
<?
get_header();
?>
<div class="l-page has-no-sidebars">
    <div class="l-main">
        <div class="l-content">
            
            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                <header class="node__heading">
                    <h1><?php the_title() ?></h1>
                </header>
                <div class="field__items">
                    <div class="field__item even">
                        <p>NOTE: This email contact can be used for seeking information and advice about this website or the campaign.</p>
                        <p>If you are concerned about your own or someone else’s gambling call 0800 654 655 or email&nbsp;<a href="mailto:info@gamblinghelpline.co.nz">info@gamblinghelpline.co.nz</a></p>
                    </div>
                </div>
            </div>
            <?php echo do_shortcode('[wpforms id="199"]') ?>
            <?php
            while (have_posts()) :
                the_post();
            ?>
            <?php


            endwhile; // End of the loop.
            ?>

        </div>
    </div>
    <?php  the_content(); ?>
</div>

<?php
get_footer();
