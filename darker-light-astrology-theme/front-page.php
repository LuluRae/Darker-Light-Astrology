<?php get_header(); ?>
<header class="hero">
    <div class="container">
        <h1>Darker Light Astrology</h1>
        <p class="tag">Clarity through the stars — readings, guides, and monthly forecasts.</p>
        <a class="btn" href="#contact">Book a Reading</a>
    </div>
</header>
<main id="content" class="container">
    <section id="about">
        <h2>About</h2>
        <p>Personalized astrology readings to help you navigate life’s cycles.</p>
    </section>
    <section id="services">
        <h2>Services</h2>
        <div class="cards">
            <article class="card">
                <h3>Birth Chart Reading</h3>
                <p>Deep dive into your natal chart — 60 minutes.</p>
            </article>
            <article class="card">
                <h3>Transit Check</h3>
                <p>Short session for current transits and timing.</p>
            </article>
        </div>
    </section>
    <section id="contact">
        <h2>Contact</h2>
        <form action="#" method="post" class="contact-form">
            <label>
                Email
                <input type="email" name="email" autocomplete="email" required>
            </label>
            <label>
                Message
                <textarea name="message" rows="4"></textarea>
            </label>
            <button class="btn" type="submit">Send</button>
        </form>
    </section>
</main>
<?php get_footer(); ?>