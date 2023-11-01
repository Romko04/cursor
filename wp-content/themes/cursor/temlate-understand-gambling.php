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
                    <?php
                    $taxonomy_name = 'understand-gambling-categories'; // Замініть 'taxonomy_name' на актуальну назву вашої таксономії.
                    $taxonomies = get_terms(array(
                        'taxonomy' => $taxonomy_name,
                        'hide_empty' => false
                    ));
                    $j = 0;
                    $currentTaxonomy = ''
                    ?>

                    <ul class="menu">
                        <?php foreach ($taxonomies as $term) :
                            if ($j == 0) {
                                $currentTaxonomy = 'active';
                            } else {
                                $currentTaxonomy = '';
                            }
                            echo '<li class="' . $currentTaxonomy . '"><a href="' . get_term_link($term) . '">' . $term->name . '</a></li>';
                            $j++;
                        ?>
                        <?php endforeach; ?>
                    </ul>
                    <!-- <ul class="menu">
                        <li class="first leaf menu-mlid-1037"><a href="/understand-gambling/how-pokies-work">How pokies work</a></li>
                        <li class="leaf menu-mlid-1673"><a href="/understand-gambling/online-gambling">Online gambling</a></li>
                        <li class="leaf menu-mlid-1674"><a href="/understand-gambling/guide-to-casino-games">Guide to casino games</a></li>
                        <li class="leaf menu-mlid-1696"><a href="/understand-gambling/how-lotto-works">How Lotto works</a></li>
                        <li class="leaf menu-mlid-995"><a href="/understand-gambling/know-your-odds">Know your odds</a></li>
                        <li class="last leaf menu-mlid-1675"><a href="/understand-gambling/gaming-vs-gambling">Gaming vs Gambling</a></li>
                    </ul> -->
                </div>
            </nav>
        </div>
        <div class="l-main">
            <div class="l-content" role="main"> <a id="main-content"></a>
                <div about="/understand-gambling" typeof="foaf:Document" class="ds-1col node node--page view-mode-full  node--full node--page--full clearfix">
                    <header class="node__heading">
                        <h1>Understand gambling</h1>
                        <div class="node__banner">
                            <div class="field field-name-field-introduction-text">
                                <p>Find out what the real odds of winning are, how pokies work, how Lotto works, and more...&nbsp;</p>
                            </div>
                        </div>
                    </header>
                </div>
                <div id="block-views-landing-page-teaser-list-block" class="block block--views block--views-landing-page-teaser-list-block">
                    <div class="block__content">
                        <div class="view view-landing-page-teaser-list view-id-landing_page_teaser_list view-display-id-block view-dom-id-96468359edea693263a9b0fefefec8da">
                            <div class="view-content">
                                <div class="views-row views-row-1 views-row-odd views-row-first">
                                    <div about="/understand-gambling/how-pokies-work" typeof="foaf:Document" class="ds-1col node node--page view-mode-teaser_image_left c-teaser--42 node--teaser-image-left node--page--teaser-image-left clearfix">
                                        <div class="field field--name-field-teaser-image field--type-image field--label-hidden">
                                            <div class="field__items">
                                                <div class="field__item even"><a href="/understand-gambling/how-pokies-work"><img typeof="foaf:Image" src="https://www.choicenotchance.org.nz/sites/default/files/styles/page_teaser/public/Asset%202%402x-1_0.png?itok=tjMeaG6g" width="320" height="280" alt=""></a></div>
                                            </div>
                                        </div>
                                        <div id="node-page-teaser-image-left-group-quote" class="group-quote field-group-div">
                                            <div class="field field--name-title field--type-ds field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="dc:title">
                                                        <h2><a href="/understand-gambling/how-pokies-work">How pokies work</a></h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="content:encoded">
                                                        <p>Pokie machines are designed to make money. They do that by getting you to stay at them for as long as possible. But, each spin will have as much chance of winning as the last one, so it doesn't matter if you have a system, you can't beat or cheat a pokie machine.</p>
                                                        <p><a href="/understand-gambling/how-pokies-work">Find out how pokies really work here</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="views-row views-row-2 views-row-even">
                                    <div about="/understand-gambling/online-gambling" typeof="foaf:Document" class="ds-1col node node--page view-mode-teaser_image_right c-teaser--273 node--teaser-image-right node--page--teaser-image-right clearfix">
                                        <div class="field field--name-field-teaser-image field--type-image field--label-hidden">
                                            <div class="field__items">
                                                <div class="field__item even"><a href="/understand-gambling/online-gambling"><img typeof="foaf:Image" src="https://www.choicenotchance.org.nz/sites/default/files/styles/page_teaser/public/Asset%202%402x_0_0.png?itok=XLnxFdd3" width="320" height="277" alt=""></a></div>
                                            </div>
                                        </div>
                                        <div id="node-page-teaser-image-right-group-quote" class="group-quote field-group-div">
                                            <div class="field field--name-title field--type-ds field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="dc:title">
                                                        <h2><a href="/understand-gambling/online-gambling">Online gambling - staying on-guard</a></h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="content:encoded">
                                                        <p>Using today's technology, it's possible to gamble almost anywhere, from the bedroom to the bathroom - even outdoors. Here are some of the traps to watch out for and some tips to keep yourself safe.</p>
                                                        <p><a href="/understand-gambling/online-gambling">Learn more</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="views-row views-row-3 views-row-odd">
                                    <div about="/understand-gambling/guide-to-casino-games" typeof="foaf:Document" class="ds-1col node node--page view-mode-teaser_image_left c-teaser--274 node--teaser-image-left node--page--teaser-image-left clearfix">
                                        <div class="field field--name-field-teaser-image field--type-image field--label-hidden">
                                            <div class="field__items">
                                                <div class="field__item even"><a href="/understand-gambling/guide-to-casino-games"><img typeof="foaf:Image" src="https://www.choicenotchance.org.nz/sites/default/files/styles/page_teaser/public/Asset%203%402x_0.png?itok=e0whXZh0" width="320" height="228" alt=""></a></div>
                                            </div>
                                        </div>
                                        <div id="node-page-teaser-image-left-group-quote--2" class="group-quote field-group-div">
                                            <div class="field field--name-title field--type-ds field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="dc:title">
                                                        <h2><a href="/understand-gambling/guide-to-casino-games">Guide to casino games</a></h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="content:encoded">
                                                        <p>Step inside a casino and the atmosphere tingles with excitement. It seems like you could make a fortune but the maths are not in your favour. Find out how casinos really work, plus tips to play it safe.</p>
                                                        <p><a href="/understand-gambling/guide-to-casino-games">Find out how casinos really work, plus tips to play it safe</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="views-row views-row-4 views-row-even">
                                    <div about="/understand-gambling/how-lotto-works" typeof="foaf:Document" class="ds-1col node node--page view-mode-teaser_image_right c-teaser--278 node--teaser-image-right node--page--teaser-image-right clearfix">
                                        <div class="field field--name-field-teaser-image field--type-image field--label-hidden">
                                            <div class="field__items">
                                                <div class="field__item even"><a href="/understand-gambling/how-lotto-works"><img typeof="foaf:Image" src="https://www.choicenotchance.org.nz/sites/default/files/styles/page_teaser/public/Asset%204%402x.png?itok=AGpRFVqS" width="320" height="233" alt=""></a></div>
                                            </div>
                                        </div>
                                        <div id="node-page-teaser-image-right-group-quote--2" class="group-quote field-group-div">
                                            <div class="field field--name-title field--type-ds field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="dc:title">
                                                        <h2><a href="/understand-gambling/how-lotto-works">How Lotto works</a></h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="content:encoded">
                                                        <p>What are your true odds of winning Lotto first division? What about Powerball?</p>
                                                        <p><a href="/understand-gambling/how-lotto-works">Try our interactive game and find out</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="views-row views-row-5 views-row-odd">
                                    <div about="/understand-gambling/know-your-odds" typeof="foaf:Document" class="ds-1col node node--page view-mode-teaser_image_left c-teaser--25 node--teaser-image-left node--page--teaser-image-left clearfix">
                                        <div class="field field--name-field-teaser-image field--type-image field--label-hidden">
                                            <div class="field__items">
                                                <div class="field__item even"><a href="/understand-gambling/know-your-odds"><img typeof="foaf:Image" src="https://www.choicenotchance.org.nz/sites/default/files/styles/page_teaser/public/Know%20your%20odds%20%282%29%20%231010809.png?itok=avgmGUcH" width="320" height="340" alt=""></a></div>
                                            </div>
                                        </div>
                                        <div id="node-page-teaser-image-left-group-quote--3" class="group-quote field-group-div">
                                            <div class="field field--name-title field--type-ds field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="dc:title">
                                                        <h2><a href="/understand-gambling/know-your-odds">Know your odds</a></h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="content:encoded">
                                                        <p>You might be hoping that a big win could make a difference for you and your family but your chances of winning while gambling are a lot lower than you might think. Getting to know your odds of winning can really put your chances into perspective.</p>
                                                        <p><a href="/understand-gambling/know-your-odds">Find out what your chances are of winning the jackpot are here</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="views-row views-row-6 views-row-even views-row-last">
                                    <div about="/understand-gambling/gaming-vs-gambling" typeof="foaf:Document" class="ds-1col node node--page view-mode-teaser_image_right c-teaser--275 node--teaser-image-right node--page--teaser-image-right clearfix">
                                        <div class="field field--name-field-teaser-image field--type-image field--label-hidden">
                                            <div class="field__items">
                                                <div class="field__item even"><a href="/understand-gambling/gaming-vs-gambling"><img typeof="foaf:Image" src="https://www.choicenotchance.org.nz/sites/default/files/styles/page_teaser/public/Asset%205%402x-1_0.png?itok=A5-hD6Ta" width="320" height="236" alt=""></a></div>
                                            </div>
                                        </div>
                                        <div id="node-page-teaser-image-right-group-quote--3" class="group-quote field-group-div">
                                            <div class="field field--name-title field--type-ds field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="dc:title">
                                                        <h2><a href="/understand-gambling/gaming-vs-gambling">The blurry line between gaming and online gambling</a></h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="field field--name-body field--type-text-with-summary field--label-hidden">
                                                <div class="field__items">
                                                    <div class="field__item even" property="content:encoded">
                                                        <p>"Free-to-play" games, apps and websites offering simulated gambling can be entertaining. But despite their name they could still cost you time and money.</p>
                                                        <p><a href="/understand-gambling/gaming-vs-gambling">Could gaming lead to gambling?</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="l-region l-region--content-after">
            <div id="block-block-12" class="block block--block promi-block icon-exclaim color-brown promi-block-left block--block-12">
                <h2 class="block__title"><a href="/how-much-is-too-much/know-the-signs" class="block-title-link">Know the signs</a></h2>
                <div class="block__content">
                    <p>It is important to recognise when your gambling is no longer just for fun.</p>
                    <p><a href="/how-much-is-too-much/know-the-signs">Learn the signs of harmful gambling</a></p>
                    <p><a class="ico" href="/how-much-is-too-much/know-the-signs">Learn the signs of harmful gambling</a></p>
                </div>
            </div>
            <div id="block-block-25" class="block block--block promi-block icon-wallet color-brown promi-block-right block--block-25">
                <h2 class="block__title"><a href="/how-much-is-too-much/how-much-are-you-spending" class="block-title-link">What are you spending?</a></h2>
                <div class="block__content">
                    <p>Want to know some other uses for your gambling money?</p>
                    <p><a href="/how-much-is-too-much/how-much-are-you-spending">Tell me more</a></p>
                    <p><a class="ico" href="/how-much-is-too-much/how-much-are-you-spending">Tell me more</a></p>
                </div>
            </div>
            <div id="block-block-1" class="block block--block need-help-now block--block-1">
                <div class="block__content">
                    <p><a href="/help-support">Need help now?</a> Call us anytime on&nbsp;<a href="tel:0800654655">0800 654 655</a> or free text <a href="sms:8006">8006</a>.&nbsp;</p>
                    <p><a href="https://www.choicenotchance.org.nz/help-support/services-near-you-0">Click here for local support.</a></p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
get_footer();
?>
</div>