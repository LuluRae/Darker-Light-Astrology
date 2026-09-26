# Darker Light Astrology WordPress API

A small WordPress plugin that adds two read-only routes to the existing WordPress REST API. It is intended for Hostinger Web/Cloud hosting where the site is already running WordPress.

## Install

Copy this plugin directory into `wp-content/plugins/darker-light-astrology-api/` or upload the provided plugin ZIP through **Plugins → Add New Plugin → Upload Plugin**, then activate **Darker Light Astrology API**.

## Routes

- `GET /wp-json/darker-light-astrology/v1/` returns a service greeting.
- `GET /wp-json/darker-light-astrology/v1/health` returns `{"status":"ok"}`.

The routes are public and expose only a status message. This starter does not calculate charts, accept birth data, or store visitor information. Add those features only after their data and privacy requirements are defined.
