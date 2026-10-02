/*
 * YouTube embeds in trusted article HTML become a click-to-play frame. The page
 * makes no request to YouTube until the reader presses play, so a slow player
 * cannot hold up the page load. Without JavaScript the link opens the video on YouTube.
 */

const PLAY_ICON = '<svg aria-hidden="true" width="56" height="56" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm36.44 110.66-48 32A8 8 0 0 1 104 160V96a8 8 0 0 1 12.44-6.66l48 32a8 8 0 0 1 0 13.32Z"/></svg>';

const YOUTUBE_IFRAME = /<iframe\s[^>]*src=["']https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]+)(?:\?[^"']*)?["'][^>]*><\/iframe>/gi;

export function withClickToPlayVideos(html: string) {
  return html.replace(YOUTUBE_IFRAME, (_full, id: string) =>
    `<div class="sr-video" data-video="${id}">`
    + `<a class="sr-video-play" href="https://www.youtube.com/watch?v=${id}" data-video-play>`
    + `${PLAY_ICON}<span>Play video</span><span class="sr-video-note">The YouTube player loads when you press play.</span></a></div>`);
}
