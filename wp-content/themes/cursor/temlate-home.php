<?php
/*
Template name: Home page
 */
?>

<div class="l-page has-no-sidebars">
    <?php
    get_header();
    ?>
    <div class="l-main-wrap">
        <div class="l-main">
            <div class="l-content" role="main">
                <a href="index.html" id="main-content"></a>
                <div class="block block--views c-slider block--views-slider-block" id="block-views-slider-block">
                    <div class="block__content">
                        <div class="view view-slider view-id-slider view-display-id-block view-dom-id-6404aaaeb37420597fb47c553d83b8f4">



                            <div class="view-content">
                                <div class="flexslider optionset-homepage-banner" id="flexslider-1">
                                    <ul class="slides">
                                        <li>
                                            <div about="/node/279" class="ds-1col node node--homepage-slide view-mode-full c-banner c-banner--campaign c-banner--brown node--full node--homepage-slide--full clearfix" typeof="sioc:Item foaf:Document">


                                                <div class="c-banner__wallpaper" style="background-image: url('<?php the_field('banner_image') ?>');">
                                                    <header class="c-banner__content">
                                                        <h2><?php the_field('banner_text') ?></h2><a href="<?php the_field('banner_link') ?>">Take the quiz</a>
                                                    </header>
                                                </div>
                                            </div>

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php the_field('banner_list') ?>
            </div>
        </div>
        <?php
        the_content()
        ?>
    </div>
    <?php
    get_footer();
    ?>
</div>