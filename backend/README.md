# Darker Light Astrology WordPress API

A small WordPress plugin that adds Darker Light Astrology routes to the existing WordPress REST API. It is intended for Hostinger Web/Cloud hosting where the site is already running WordPress.

## Install

Copy this plugin directory into `wp-content/plugins/darker-light-astrology-api/` or upload the provided plugin ZIP through **Plugins → Add New Plugin → Upload Plugin**, then activate **Darker Light Astrology API**.

## Public routes

- `GET /wp-json/darker-light-astrology/v1/` returns a service greeting and plugin version.
- `GET /wp-json/darker-light-astrology/v1/health` returns `{"status":"ok"}`.

These routes are public and expose only status information.

## My Rabbit Hole member routes

The private member routes use the currently logged-in WordPress account. They are intended to be called from the Darker Light site while the member is authenticated with WordPress cookie authentication and a valid REST nonce.

- `GET /wp-json/darker-light-astrology/v1/me` returns the current member's saved Darker Light profile.
- `POST /wp-json/darker-light-astrology/v1/me` creates or updates approved profile fields.
- `DELETE /wp-json/darker-light-astrology/v1/me` deletes the current member's saved Darker Light profile data.

The private profile can store:

- chosen guide (`rabbit`, `hatter`, `cat`, `caterpillar`, or `queen`)
- birth date, time, place, and UTC offset
- rabbit-hole progress
- sanitized chart data
- sanitized preferences

## Privacy and security notes

- Member profile data is stored in WordPress user meta under `_dla_member_profile` and is tied to the logged-in WordPress user ID.
- The `/me` routes reject unauthenticated visitors.
- The API only accepts a limited set of approved fields and sanitizes values before saving them.
- Members can erase their saved Darker Light profile through the `DELETE /me` route.
- Payment-card information should never be stored in this profile. Payments should be handled by a dedicated payment processor.
- Exact birth details are personal information. The live site should explain why they are collected, obtain appropriate consent, and provide a clear privacy policy before enabling member saves in production.

## Next frontend step

Create a **My Rabbit Hole** member page that:

1. detects whether the visitor is logged in,
2. loads `GET /me`,
3. lets the member save their chosen guide, chart/birth details, and journey progress with `POST /me`,
4. provides a visible **Delete my saved data** control using `DELETE /me`, and
5. resumes the member's journey at their saved `current_stage`.

This backend is the secure storage foundation. The existing standalone GitHub HTML preview does not yet authenticate against WordPress; the member dashboard should be connected when the Darker Light frontend is served from the WordPress site or otherwise uses a deliberate secure authentication flow.
