<?php get_header(); ?>
<main id="content" class="container">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
            <h1><?php the_title(); ?></h1>
            <div><?php the_content(); ?></div>
        </article>
    <?php endwhile; else : ?>
        <p><?php esc_html_e( 'Nothing has been published yet.', 'darker-light-astrology' ); ?></p>
    <?php endif; ?>
</main>
<?php get_footer(); ?>