import { getMediaType } from '../media';
import { getYoutubeId } from '../media';

describe('getMediaType', () => {
  it('returns "none" when url is undefined', () => {
    expect(getMediaType()).toBe('none');
  });

  it('returns "none" when url is empty string', () => {
    expect(getMediaType('')).toBe('none');
  });

  it('detects image by extension', () => {
    expect(getMediaType('https://example.com/image.jpg')).toBe('image');
    expect(getMediaType('https://example.com/image.png')).toBe('image');
    expect(getMediaType('https://example.com/image.webp')).toBe('image');
    expect(getMediaType('https://example.com/image.svg')).toBe('image');
  });

  it('detects image by extension ignoring query params', () => {
    expect(
      getMediaType('https://example.com/image.jpg?token=123')
    ).toBe('image');
  });

  it('detects video by extension', () => {
    expect(getMediaType('https://example.com/video.mp4')).toBe('video');
    expect(getMediaType('https://example.com/video.webm')).toBe('video');
    expect(getMediaType('https://example.com/video.ogg')).toBe('video');
  });

  it('detects youtube long url', () => {
    expect(
      getMediaType('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    ).toBe('youtube');
  });

  it('detects youtube short url', () => {
    expect(
      getMediaType('https://youtu.be/dQw4w9WgXcQ')
    ).toBe('youtube');
  });

  it('returns generic-link for unknown urls', () => {
    expect(
      getMediaType('https://example.com/some-page')
    ).toBe('generic-link');
  });

  it('returns generic-link for file sharing links', () => {
    expect(
      getMediaType('https://drive.google.com/file/d/123/view')
    ).toBe('generic-link');
  });

  it('returns generic-link for invalid urls', () => {
    expect(
      getMediaType('not-a-valid-url')
    ).toBe('generic-link');
  });
});


describe('getYoutubeId', () => {
  // ---------- Valid YouTube URLs ----------
  it('extracts id from standard watch url', () => {
    expect(
      getYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts id from short youtu.be url', () => {
    expect(
      getYoutubeId('https://youtu.be/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts id from embed url', () => {
    expect(
      getYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts id from /v/ url', () => {
    expect(
      getYoutubeId('https://www.youtube.com/v/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts id when v param is not first', () => {
    expect(
      getYoutubeId(
        'https://www.youtube.com/watch?feature=youtu.be&v=dQw4w9WgXcQ'
      )
    ).toBe('dQw4w9WgXcQ');
  });

  // ---------- Edge cases ----------
  it('returns null when id length is not 11', () => {
    expect(
      getYoutubeId('https://www.youtube.com/watch?v=short')
    ).toBeNull();
  });

  it('returns null for non-youtube urls', () => {
    expect(
      getYoutubeId('https://vimeo.com/123456')
    ).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getYoutubeId('')).toBeNull();
  });

  it('returns null for random text', () => {
    expect(getYoutubeId('not a url at all')).toBeNull();
  });

  // ---------- Playlists & timestamps ----------
  it('extracts id ignoring playlist and timestamp params', () => {
    expect(
      getYoutubeId(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=PL123'
      )
    ).toBe('dQw4w9WgXcQ');
  });
});
