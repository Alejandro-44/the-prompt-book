type MediaType = 'image' | 'video' | 'youtube' | 'generic-link' | 'none';

export const getMediaType = (url?: string): MediaType => {
  if (!url) return 'none';

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
  if (youtubeRegex.test(url)) {
    return 'youtube';
  }

  let hostname = '';
  let extension = '';

  try {
    const parsed = new URL(url);
    hostname = parsed.hostname;
    extension = parsed.pathname.split('.').pop()?.toLowerCase() ?? '';
  } catch {
    return 'generic-link';
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }

  if (['mp4', 'webm', 'ogg'].includes(extension)) {
    return 'video';
  }

  if (
    ['imgur.com', 'unsplash.com']
      .some(h => hostname.includes(h))
  ) {
    return 'image';
  }

  return 'generic-link';
};


export const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
