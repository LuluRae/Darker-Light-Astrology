<?php
/**
 * Plugin Name: Darker Light Astrology API
 * Description: Adds lightweight status endpoints to the WordPress REST API.
 * Version: 0.1.0
 * Requires PHP: 7.4
 * Text Domain: darker-light-astrology-api
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/** Register the public API routes. */
function dla_api_register_routes() {
    register_rest_route(
        'darker-light-astrology/v1',
        '/',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'dla_api_root',
            'permission_callback' => '__return_true',
        )
    );

    register_rest_route(
        'darker-light-astrology/v1',
        '/health',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'dla_api_health',
            'permission_callback' => '__return_true',
        )
    );
}
add_action( 'rest_api_init', 'dla_api_register_routes' );

/** Return a simple service greeting. */
function dla_api_root() {
    return array(
        'message' => 'Darker Light Astrology backend running',
    );
}

/** Return a health status without exposing server details. */
function dla_api_health() {
    return array(
        'status' => 'ok',
    );
}
