DARKER LIGHT ASTROLOGY THEME

Install
1. In WordPress, open Appearance > Themes > Add New Theme > Upload Theme.
2. Select darker-light-astrology-theme.zip, install it, then activate the theme.
3. Open the site's home page to see the one-page design.

MY RABBIT HOLE MEMBER DASHBOARD

The theme now includes page-my-rabbit-hole.php. WordPress will use it automatically for a Page whose slug is:

my-rabbit-hole

To make the dashboard available:
1. Make sure the Darker Light Astrology API plugin is updated to version 0.2.0 or later and activated.
2. In WordPress, create a Page named "My Rabbit Hole" with the slug "my-rabbit-hole", then publish it.
3. Logged-out visitors will see a sign-in prompt. Logged-in members can load and save their private Darker Light profile.
4. If you want visitors to create accounts themselves, enable WordPress membership registration under Settings > General > Membership. Review your anti-spam, privacy, and account policies before opening registration publicly.

The dashboard currently supports:
- chosen guide (Rabbit, Hatter, Cat, Caterpillar, or Queen)
- birth date, birth time, birth place, and UTC offset
- current astrology layer and completed layers
- personal "threads" / notes
- deletion of the saved Darker Light profile data while leaving the WordPress account intact

The API stores member data in WordPress user metadata and requires an authenticated WordPress session for the private /wp-json/darker-light-astrology/v1/me route. The dashboard sends a WordPress REST nonce for authenticated requests.

Do not store payment-card details in this profile. Purchases and payment details should be handled by a payment provider. "My Readings" and "My Library" are visual placeholders until booking/order integrations are added.

The contact form is still a visual placeholder and does not send messages. Connect a form plugin or configure a mail handler before publishing it for visitors.
