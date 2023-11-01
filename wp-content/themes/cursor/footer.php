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
				<a href="http://www.smokefree.org.nz/" rel="external" target="_blank" title="Visit the Homepage | Health Promotion Agency’s Smokefree website"><svg height="82" viewBox="0 0 284 82" width="284" xmlns="http://www.w3.org/2000/svg">
						<g fill="none">
							<path class="svg__primary" d="M35.7,0.2 C16.1,0.2 0.2,16.3 0.2,35.9 C0.2,55.5 16.1,71.4 35.7,71.4 C55.3,71.4 71.2,55.5 71.2,35.9 C71.2,34.5 71.2,13.8 71.2,12.6 C71.2,7 74.7,3.5 74.8,1.7 L74.8,1.6 C74.8,0.7 73.7,0.3 70.8,0.3 C70.7,0.2 39,0.2 35.7,0.2 Z"></path>
							<path class="svg__white" d="M47.5 35.6C47.5 32.3 46 30.4 46 30.4 44.2 27.7 40.7 25.9 37.3 25.9 33.9 25.9 30.7 27.6 28.9 30.3 28.9 30.3 27.3 32.1 27.3 35.7L27.3 53.2 27.4 53.2C29.4 53.2 30.4 51.7 30.4 51.1L30.4 35.8C30.4 32.2 33.5 29.2 37.3 29.1 41.3 29 44.4 31.9 44.4 35.7 44.4 39.6 41.4 42.2 38.6 42.2 37.8 42.2 36.1 41.9 35.6 41 37.8 41.1 38.8 39.1 38.8 38.1L38.8 38C38.8 37.3 38.6 36.7 38.3 36.2 37.8 35.5 37 35 36.1 34.9 35.9 34.9 35.6 34.9 35.4 34.9L35.3 34.9C35.2 34.9 35.1 34.9 35 35 34.9 35 34.8 35.1 34.7 35.1 34.6 35.1 34.5 35.2 34.4 35.2L34.3 35.2C32.9 35.9 32.1 37.3 32.1 39L32.1 39.3C32.1 43.5 35.4 45.4 38.7 45.4 42.3 45.4 44.9 43.2 46.3 41.1 46 41.2 47.5 38.9 47.5 35.6M58.1 42.4C54.4 42.4 51.4 39.4 51.4 35.7 51.4 32 54.4 29 58.1 29 61.8 29 64.8 32 64.8 35.7 64.8 39.4 61.8 42.4 58.1 42.4M68 36.1C68 36 68 35.9 68 35.8 68 35.3 68 34.7 67.9 34.2 67.9 34.1 67.9 34.1 67.9 34.1 67.1 29.4 63 25.9 58.1 25.9 52.6 25.9 48.2 30.3 48.2 35.8 48.2 41.3 52.6 45.7 58.1 45.7 59.5 45.7 60.8 45.4 62.1 44.9 63.1 44.5 64 44 64.8 43.2 64.8 44.3 64.8 45.4 64.8 45.4 65.7 45.4 66.7 45.3 67.4 44.6 68.1 43.8 68 42 68 42L68 36.4C68 36.4 68 36.2 68 36.1M7.1 43.6L7.1 21.1C7.1 20.5 7.6 19 9.6 19L10.3 19 10.3 28.2C11.9 26.7 14 25.9 16.3 25.9 19.5 25.9 22.4 27.6 24.1 30.3 24.1 30.3 25.7 32.7 25.7 35.9L25.7 43.6C25.7 44.2 24.7 45.7 22.6 45.7L22.5 45.7 22.5 35.7C22.5 32.1 19.7 29.1 16.4 29.1 13.1 29.1 10.5 32 10.4 35.7L10.4 45.7 9.6 45.7C7.5 45.7 7.1 44.2 7.1 43.6"></path>
							<path class="svg__secondary" d="M197.3 19.8L197.3 12C197.3 9.7 198.9 8.3 201 8.3 203.3 8.3 203.7 10 203.7 11.4L203.7 19.8 206.6 19.8 206.6 10.8C206.6 7.7 204.9 5.7 201.8 5.7 199.9 5.7 198.4 6.5 197.3 8L197.3 6 194.4 6 194.4 19.8 197.3 19.8zM189.4 12.9C189.4 15.6 188 17.6 185.5 17.6 183 17.6 181.6 15.6 181.6 12.9 181.6 10.2 183 8.2 185.5 8.2 188 8.1 189.4 10.2 189.4 12.9zM192.5 12.9C192.5 8.7 189.8 5.6 185.5 5.6 181.2 5.6 178.5 8.6 178.5 12.9 178.5 17.1 181.2 20.1 185.5 20.1 189.8 20.1 192.5 17.1 192.5 12.9zM176.5.9L173.6.9 173.6 3.6 176.5 3.6 176.5.9zM176.5 5.9L173.6 5.9 173.6 19.7 176.5 19.7 176.5 5.9zM171.2 16.9C170.8 17.2 170.2 17.5 169.5 17.5 168.3 17.5 167.6 16.8 167.6 15.4L167.6 8.1 171.9 8.1 171.9 5.9 167.6 5.9 167.6 2.2 164.7 2.2 164.7 5.9 162.4 5.9 162.4 8.1 164.7 8.1 164.7 15.4C164.7 16.7 164.9 17.6 165.4 18.3 166.2 19.5 167.5 20.1 169.1 20.1 170.4 20.1 171.5 19.7 172.4 19.1L171.2 16.9zM158.8 12.9C158.8 15.6 157.4 17.6 154.9 17.6 152.4 17.6 151 15.6 151 12.9 151 10.2 152.4 8.2 154.9 8.2 157.4 8.1 158.8 10.2 158.8 12.9zM161.9 12.9C161.9 8.7 159.2 5.6 154.9 5.6 150.6 5.6 147.9 8.6 147.9 12.9 147.9 17.1 150.6 20.1 154.9 20.1 159.2 20.1 161.9 17.1 161.9 12.9zM128.3 19.8L128.3 12C128.3 9.7 129.8 8.3 131.7 8.3 133.9 8.3 134.3 9.9 134.3 11.4L134.3 19.8 137.2 19.8 137.2 12C137.2 9.7 138.7 8.3 140.6 8.3 142.8 8.3 143.2 9.9 143.2 11.4L143.2 19.8 146.1 19.8 146.1 10.7C146.1 7.6 144.5 5.6 141.5 5.6 139.6 5.6 137.9 6.5 136.7 8.2 136.1 6.5 134.7 5.6 132.7 5.6 130.9 5.6 129.5 6.4 128.4 7.9L128.4 5.9 125.5 5.9 125.5 19.7 128.3 19.7 128.3 19.8zM120.3 12.9C120.3 15.6 118.9 17.6 116.4 17.6 113.9 17.6 112.5 15.6 112.5 12.9 112.5 10.2 113.9 8.2 116.4 8.2 118.9 8.1 120.3 10.2 120.3 12.9zM123.4 12.9C123.4 8.7 120.7 5.6 116.4 5.6 112.1 5.6 109.4 8.6 109.4 12.9 109.4 17.1 112.1 20.1 116.4 20.1 120.7 20.1 123.4 17.1 123.4 12.9zM109.4 6.1C109 5.8 108.3 5.6 107.6 5.6 106 5.6 104.6 6.7 103.7 8.1L103.7 5.9 100.8 5.9 100.8 19.7 103.7 19.7 103.7 12.7C103.7 10.1 105.3 8.5 107 8.5 107.6 8.5 108.1 8.7 108.6 8.9L109.4 6.1zM87.8 12.9C87.8 10.3 89.2 8.3 91.8 8.3 94.4 8.3 95.7 10.4 95.7 12.9 95.7 15.4 94.4 17.5 91.8 17.5 89.3 17.5 87.8 15.4 87.8 12.9zM84.9 5.9L84.9 24.3 87.8 24.3 87.8 17.7C89.1 19.3 90.7 20 92.5 20 96.4 20 98.8 16.9 98.8 12.7 98.8 8.6 96.4 5.5 92.5 5.5 90.7 5.5 89.1 6.2 87.8 7.8L87.8 5.8 84.9 5.8 84.9 5.9zM66.8 19.7L66.8 12C66.8 9.7 68.4 8.3 70.5 8.3 72.8 8.3 73.2 10 73.2 11.4L73.2 19.8 76.1 19.8 76.1 10.8C76.1 7.7 74.4 5.7 71.3 5.7 69.4 5.7 67.9 6.5 66.8 8L66.8 1 63.9 1 63.9 19.8 66.8 19.8 66.8 19.7zM61 16.9C60.6 17.2 60 17.5 59.3 17.5 58.1 17.5 57.4 16.8 57.4 15.4L57.4 8.1 61.7 8.1 61.7 5.9 57.4 5.9 57.4 2.2 54.5 2.2 54.5 5.9 52.2 5.9 52.2 8.1 54.5 8.1 54.5 15.4C54.5 16.7 54.7 17.6 55.2 18.3 56 19.5 57.3 20.1 58.9 20.1 60.2 20.1 61.3 19.7 62.2 19.1L61 16.9zM46.8 16.1C46.8 17.3 46.9 18.1 47.4 18.7 48 19.6 49.1 20 50.4 20 51.4 20 52.2 19.8 52.6 19.5L52 17.3C51.8 17.4 51.3 17.6 50.8 17.6 50.1 17.6 49.6 17.3 49.6 16.1L49.6.9 46.7.9 46.7 16.1 46.8 16.1zM40.5 12.8C40.5 15.4 39.1 17.4 36.5 17.4 33.9 17.4 32.6 15.3 32.6 12.8 32.6 10.2 33.9 8.2 36.5 8.2 39.1 8.2 40.5 10.2 40.5 12.8zM43.4 5.9L40.5 5.9 40.5 7.9C39.3 6.2 37.7 5.6 35.8 5.6 31.9 5.6 29.4 8.7 29.4 12.9 29.4 17 31.8 20.1 35.8 20.1 37.6 20.1 39.4 19.5 40.6 17.8 41 19.4 42.3 20 43.6 20 44.1 20 44.9 19.9 45.4 19.7L45.1 17.7C44.9 17.8 44.6 17.9 44.3 17.9 43.6 17.9 43.3 17.5 43.3 16.6L43.3 5.9 43.4 5.9zM17.4 11.4C17.6 9.3 19 7.9 21.2 7.9 23.2 7.9 24.8 9.1 25 11.4L17.4 11.4zM28 12.5C28 8.5 25.4 5.5 21.2 5.5 16.8 5.5 14.2 8.7 14.2 12.8 14.2 16.9 16.8 20 21.5 20 24.1 20 26.1 19 27.5 17.5L25.6 15.7C24.6 16.8 23.2 17.4 21.6 17.4 19.1 17.4 17.5 16 17.4 13.5L28 13.5C28 13.3 28 13 28 12.5zM3.2 19.7L3.2 12C3.2 9.7 4.8 8.3 6.9 8.3 9.2 8.3 9.6 10 9.6 11.4L9.6 19.8 12.5 19.8 12.5 10.8C12.5 7.7 10.8 5.7 7.7 5.7 5.8 5.7 4.3 6.5 3.2 8L3.2 1 .3 1 .3 19.8 3.2 19.8 3.2 19.7zM81.1 37.4C81.1 40.5 78.9 41.6 76.6 41.6 75.2 41.6 73.7 41.2 72.5 40.2L71.5 41.6C72.8 42.6 74.4 43.2 76.5 43.2 78.8 43.2 80.5 42.4 81.5 41.2 82.4 40.1 82.7 38.8 82.7 37.1L82.7 25.3 81.1 25.3 81.1 31.7C81.1 34.5 79.2 36.4 76.6 36.4 73.8 36.4 73.3 34.3 73.3 32.5L73.3 25.3 71.7 25.3 71.7 32.9C71.7 36.2 73.6 38 76.4 38 78.5 38 80 37 81.1 35.3L81.1 37.4zM68.6 35.2C67.8 36.4 66.5 37.3 64.7 37.3 61.9 37.3 60.2 35 60.2 31.9 60.2 28.9 61.9 26.6 64.7 26.6 66.4 26.6 67.7 27.4 68.5 28.6L69.8 27.6C68.6 26 66.9 25 64.7 25 60.9 25 58.4 28 58.4 31.9 58.4 35.8 60.8 38.8 64.6 38.8 66.9 38.8 68.7 37.7 69.8 36.2L68.6 35.2zM46.9 38.5L46.9 31.2C46.9 28.4 48.8 26.5 51.4 26.5 54.2 26.5 54.7 28.6 54.7 30.4L54.7 38.5 56.3 38.5 56.3 30C56.3 26.7 54.4 24.9 51.6 24.9 49.5 24.9 48 25.9 46.9 27.6L46.9 25.2 45.3 25.2 45.3 38.4 46.9 38.4 46.9 38.5zM32.3 30.8C32.5 28.3 34.2 26.5 36.8 26.5 39.1 26.5 41 28 41.3 30.8L32.3 30.8zM43 31.5C43 27.9 40.6 25 36.8 25 32.9 25 30.5 28.1 30.5 32 30.5 35.9 33 38.9 37.1 38.9 39.3 38.9 40.9 38.1 42.3 36.6L41.1 35.4C40 36.6 38.7 37.2 37.1 37.2 34.3 37.2 32.4 35.3 32.2 32.3L43 32.3C43 32.1 43 31.9 43 31.5zM26.6 31.4C26.6 34.1 24.9 36.3 21.8 36.3 18.7 36.3 17.2 34 17.2 31.4 17.2 28.8 18.7 26.5 21.8 26.5 24.9 26.6 26.6 28.8 26.6 31.4zM28.2 36.5L28.2 25.3 26.6 25.3 26.6 27.7C25.5 25.8 23.6 25 21.6 25 18.1 25 15.5 27.7 15.5 31.5 15.5 35.2 18 37.9 21.5 37.9 23.5 37.9 25.5 37.1 26.6 35.2L26.6 36.8C26.6 40.2 24.4 41.6 21.6 41.6 19.8 41.6 18.3 41.1 17.1 40.2L16.1 41.6C17.6 42.7 19.4 43.2 21.5 43.2 23.7 43.2 25.6 42.6 26.9 41.1 27.8 40 28.2 38.5 28.2 36.5zM10.9 31.9C10.9 34.9 9.3 37.2 6.2 37.2 3.1 37.2 1.6 34.8 1.6 31.9 1.6 28.9 3.1 26.6 6.2 26.6 9.3 26.5 10.9 28.9 10.9 31.9zM12.6 25.3L11 25.3 11 27.7C9.7 25.7 7.9 25 6.1 25 2.3 25 0 28 0 31.9 0 35.8 2.3 38.8 6.2 38.8 7.9 38.8 9.9 38.2 11.1 36.3 11.3 38 12.4 38.7 13.6 38.7 14 38.7 14.5 38.6 14.9 38.5L14.7 37.1C14.5 37.2 14.2 37.3 13.9 37.3 13 37.3 12.7 36.8 12.7 35.7L12.7 25.3 12.6 25.3z" transform="translate(77 17)"></path>
							<g class="svg__primary" transform="translate(77 69)">
								<polygon points="6.1 2 6.1 12.6 4.4 12.6 4.4 2 .3 2 .3 .4 10.3 .4 10.3 2"></polygon>
								<polygon points="12 12.6 12 .4 20.6 .4 20.6 2 13.7 2 13.7 5.4 19.7 5.4 19.7 6.9 13.7 6.9 13.7 11 20.8 11 20.8 12.6"></polygon>
								<polygon points="36.6 12.6 36.6 6.9 30 6.9 30 12.6 28.3 12.6 28.3 .4 30 .4 30 5.3 36.6 5.3 36.6 .4 38.3 .4 38.3 12.6 36.6 12.6"></polygon>
								<polygon points="41.2 12.6 41.2 .4 42.9 .4 42.9 12.6 41.2 12.6"></polygon>
								<path d="M53.6,12.6 L51,7.7 L47.5,7.7 L47.5,12.6 L45.8,12.6 L45.8,0.4 L51.1,0.4 C53.6,0.4 55.2,1.8 55.2,4 C55.2,5.7 54.1,6.9 52.7,7.4 L55.5,12.6 L53.6,12.6 Z M51.1,2 L47.5,2 L47.5,6.2 L51.1,6.2 C52.5,6.2 53.4,5.4 53.4,4.1 C53.4,2.8 52.5,2 51.1,2 Z"></path>
								<polygon points="57.9 12.6 57.9 .4 59.6 .4 59.6 12.6 57.9 12.6"></polygon>
								<polygon points="70.1 12.6 63.7 2.6 63.7 12.6 62.1 12.6 62.1 .4 64.3 .4 70.5 10.2 70.5 .4 72.1 .4 72.1 12.6 70.1 12.6"></polygon>
								<path d="M76.1 6.5C76.1 9.3 77.7 11.2 80.2 11.2 82.4 11.2 84 9.9 84.1 7.8L80.2 7.8 80.2 6.3 85.8 6.3C85.8 6.5 85.9 6.8 85.9 7.2 85.9 10.1 83.9 12.7 80.3 12.7 76.7 12.7 74.4 10 74.4 6.4 74.4 2.7 76.7.1 80.3.1 82.4.1 84 1 85.1 2.5L83.7 3.4C83 2.3 81.8 1.6 80.3 1.6 77.6 1.8 76.1 3.7 76.1 6.5zM96.3 12.6L95 9.2 89.5 9.2 88.2 12.6 86.4 12.6 91.3.4 93.2.4 98.2 12.6 96.3 12.6zM92.3 2.1L90.1 7.7 94.4 7.7 92.3 2.1z"></path>
								<polygon points="113.3 12.6 113.3 6.9 106.7 6.9 106.7 12.6 105 12.6 105 .4 106.7 .4 106.7 5.3 113.3 5.3 113.3 .4 115 .4 115 12.6 113.3 12.6"></polygon>
								<path d="M126.3 12.6L125 9.2 119.5 9.2 118.2 12.6 116.4 12.6 121.3.4 123.2.4 128.2 12.6 126.3 12.6zM122.3 2.1L120.1 7.7 124.4 7.7 122.3 2.1zM138.6 8C138.6 10.9 136.5 12.8 133.6 12.8 130.7 12.8 128.6 11 128.6 8L128.6.4 130.3.4 130.3 8C130.3 9.9 131.5 11.2 133.6 11.2 135.6 11.2 136.9 9.9 136.9 8L136.9.4 138.6.4 138.6 8zM146.1 12.8C142.5 12.8 140.2 10.1 140.2 6.5 140.2 2.9 142.5.2 146.1.2 149.7.2 152 2.9 152 6.5 152.1 10.1 149.8 12.8 146.1 12.8zM146.1 1.8C143.5 1.8 142 3.7 142 6.5 142 9.3 143.6 11.2 146.1 11.2 148.7 11.2 150.2 9.2 150.2 6.5 150.2 3.8 148.7 1.8 146.1 1.8zM161.6 12.6L159 7.7 155.5 7.7 155.5 12.6 153.8 12.6 153.8.4 159.1.4C161.6.4 163.2 1.8 163.2 4 163.2 5.7 162.1 6.9 160.7 7.4L163.5 12.6 161.6 12.6zM159.1 2L155.5 2 155.5 6.2 159.1 6.2C160.5 6.2 161.4 5.4 161.4 4.1 161.5 2.8 160.5 2 159.1 2zM174.7 12.6L173.4 9.2 167.9 9.2 166.6 12.6 164.8 12.6 169.7.4 171.6.4 176.6 12.6 174.7 12.6zM170.7 2.1L168.5 7.7 172.8 7.7 170.7 2.1z"></path>
							</g>
						</g>
					</svg></a>
			</div>
		</div>
		<a class="chat-button mobile--not-fixed" href="#" onclick="OpenChatBox()">Click here to chat with us</a>
	</div>
</footer>

&nbsp;

<?php wp_footer(); ?>

</body>

</html>