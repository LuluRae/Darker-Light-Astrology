<?php
/** Theme setup and styles. */
function dla_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'dla_theme_setup' );

function dla_theme_enqueue_styles() {
    wp_enqueue_style(
        'darker-light-astrology-style',
        get_stylesheet_uri(),
        array(),
        '1.0.0'
    );
}
add_action( 'wp_enqueue_scripts', 'dla_theme_enqueue_styles' );