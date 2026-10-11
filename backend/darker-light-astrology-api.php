<?php
/**
 * Plugin Name: Darker Light Astrology API
 * Description: Adds Darker Light Astrology REST API endpoints, including a private member profile for My Rabbit Hole.
 * Version: 0.2.0
 * Requires PHP: 7.4
 * Text Domain: darker-light-astrology-api
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

const DLA_MEMBER_PROFILE_META_KEY = '_dla_member_profile';

/** Register the public and private API routes. */
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

    register_rest_route(
        'darker-light-astrology/v1',
        '/me',
        array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => 'dla_api_get_member_profile',
                'permission_callback' => 'dla_api_require_login',
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => 'dla_api_save_member_profile',
                'permission_callback' => 'dla_api_require_login',
            ),
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => 'dla_api_delete_member_profile',
                'permission_callback' => 'dla_api_require_login',
            ),
        )
    );
}
add_action( 'rest_api_init', 'dla_api_register_routes' );

/** Return a simple service greeting. */
function dla_api_root() {
    return array(
        'message' => 'Darker Light Astrology backend running',
        'version' => '0.2.0',
    );
}

/** Return a health status without exposing server details. */
function dla_api_health() {
    return array(
        'status' => 'ok',
    );
}

/** Require a logged-in WordPress account for private member routes. */
function dla_api_require_login() {
    if ( ! is_user_logged_in() ) {
        return new WP_Error(
            'dla_not_logged_in',
            'You must be logged in to access My Rabbit Hole.',
            array( 'status' => 401 )
        );
    }

    return true;
}

/** Return the current member's saved Darker Light profile. */
function dla_api_get_member_profile() {
    $user_id = get_current_user_id();
    $user    = wp_get_current_user();
    $profile = get_user_meta( $user_id, DLA_MEMBER_PROFILE_META_KEY, true );

    if ( ! is_array( $profile ) ) {
        $profile = array();
    }

    return rest_ensure_response(
        array(
            'member'  => array(
                'id'           => $user_id,
                'display_name' => $user->display_name,
            ),
            'profile' => $profile,
        )
    );
}

/** Save only the approved My Rabbit Hole fields for the current member. */
function dla_api_save_member_profile( WP_REST_Request $request ) {
    $user_id  = get_current_user_id();
    $incoming = $request->get_json_params();

    if ( ! is_array( $incoming ) ) {
        return new WP_Error(
            'dla_invalid_profile',
            'Profile data must be sent as JSON.',
            array( 'status' => 400 )
        );
    }

    $existing = get_user_meta( $user_id, DLA_MEMBER_PROFILE_META_KEY, true );
    if ( ! is_array( $existing ) ) {
        $existing = array();
    }

    $profile = dla_api_sanitize_member_profile( $incoming, $existing );
    $profile['updated_at'] = current_time( 'mysql', true );

    if ( empty( $profile['created_at'] ) ) {
        $profile['created_at'] = $profile['updated_at'];
    }

    update_user_meta( $user_id, DLA_MEMBER_PROFILE_META_KEY, $profile );

    return rest_ensure_response(
        array(
            'saved'   => true,
            'profile' => $profile,
        )
    );
}

/** Allow a member to erase their saved Darker Light profile data. */
function dla_api_delete_member_profile() {
    $user_id = get_current_user_id();
    delete_user_meta( $user_id, DLA_MEMBER_PROFILE_META_KEY );

    return rest_ensure_response(
        array(
            'deleted' => true,
        )
    );
}

/**
 * Sanitize the limited set of profile fields used by My Rabbit Hole.
 * Existing values are preserved when a field is omitted from an update.
 */
function dla_api_sanitize_member_profile( array $incoming, array $existing = array() ) {
    $profile = $existing;

    if ( array_key_exists( 'guide', $incoming ) ) {
        $allowed_guides = array( 'rabbit', 'hatter', 'cat', 'caterpillar', 'queen' );
        $guide = sanitize_key( (string) $incoming['guide'] );
        $profile['guide'] = in_array( $guide, $allowed_guides, true ) ? $guide : '';
    }

    if ( array_key_exists( 'birth', $incoming ) && is_array( $incoming['birth'] ) ) {
        $birth = isset( $profile['birth'] ) && is_array( $profile['birth'] ) ? $profile['birth'] : array();

        if ( array_key_exists( 'date', $incoming['birth'] ) ) {
            $date = sanitize_text_field( (string) $incoming['birth']['date'] );
            $birth['date'] = preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ? $date : '';
        }

        if ( array_key_exists( 'time', $incoming['birth'] ) ) {
            $time = sanitize_text_field( (string) $incoming['birth']['time'] );
            $birth['time'] = preg_match( '/^([01]\d|2[0-3]):[0-5]\d$/', $time ) ? $time : '';
        }

        if ( array_key_exists( 'place', $incoming['birth'] ) ) {
            $birth['place'] = substr( sanitize_text_field( (string) $incoming['birth']['place'] ), 0, 180 );
        }

        if ( array_key_exists( 'utc_offset', $incoming['birth'] ) ) {
            $offset = (float) $incoming['birth']['utc_offset'];
            $birth['utc_offset'] = max( -14, min( 14, $offset ) );
        }

        $profile['birth'] = $birth;
    }

    if ( array_key_exists( 'progress', $incoming ) && is_array( $incoming['progress'] ) ) {
        $progress = isset( $profile['progress'] ) && is_array( $profile['progress'] ) ? $profile['progress'] : array();

        if ( array_key_exists( 'current_stage', $incoming['progress'] ) ) {
            $progress['current_stage'] = substr( sanitize_key( (string) $incoming['progress']['current_stage'] ), 0, 60 );
        }

        if ( array_key_exists( 'completed_stages', $incoming['progress'] ) && is_array( $incoming['progress']['completed_stages'] ) ) {
            $completed = array_map( 'sanitize_key', $incoming['progress']['completed_stages'] );
            $progress['completed_stages'] = array_slice( array_values( array_unique( array_filter( $completed ) ) ), 0, 30 );
        }

        $profile['progress'] = $progress;
    }

    if ( array_key_exists( 'chart', $incoming ) && is_array( $incoming['chart'] ) ) {
        $profile['chart'] = dla_api_sanitize_nested_value( $incoming['chart'], 0 );
    }

    if ( array_key_exists( 'preferences', $incoming ) && is_array( $incoming['preferences'] ) ) {
        $profile['preferences'] = dla_api_sanitize_nested_value( $incoming['preferences'], 0 );
    }

    return $profile;
}

/** Recursively sanitize small chart/preference structures without accepting objects or executable content. */
function dla_api_sanitize_nested_value( $value, $depth = 0 ) {
    if ( $depth > 4 ) {
        return null;
    }

    if ( is_array( $value ) ) {
        $clean = array();
        $count = 0;

        foreach ( $value as $key => $item ) {
            if ( $count >= 100 ) {
                break;
            }

            $clean_key = is_int( $key ) ? $key : substr( sanitize_key( (string) $key ), 0, 60 );
            $clean[ $clean_key ] = dla_api_sanitize_nested_value( $item, $depth + 1 );
            $count++;
        }

        return $clean;
    }

    if ( is_bool( $value ) || is_int( $value ) || is_float( $value ) ) {
        return $value;
    }

    if ( is_string( $value ) ) {
        return substr( sanitize_text_field( $value ), 0, 500 );
    }

    return null;
}
