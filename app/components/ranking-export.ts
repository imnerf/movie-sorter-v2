import type { Movie } from '@/app/data/movies';

export type ExportRankingItem = {
  movie: Movie;
  rank: number;
  tied: boolean;
};

type LoadedPoster = {
  image: HTMLImageElement | null;
  cleanup: () => void;
};

const COLORS = {
  background: '#110e0e',
  surface: '#1b1717',
  foreground: '#f6efe5',
  muted: '#9f948c',
  primary: '#e64b42',
  border: '#3b3230',
};

const DISPLAY_FONT = 'Georgia, "Times New Roman", serif';
const WORDMARK_FONT = '"Archivo Black", Impact, sans-serif';
const ITALIC_FONT = '"Instrument Serif", Georgia, serif';
const SANS_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function wrapLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  let overflowed = false;

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) {
      current = words.slice(index).join(' ');
      overflowed = true;
      break;
    }
  }

  if (lines.length < maxLines && current) lines.push(current);
  if (overflowed && lines.length) {
    let last = lines[lines.length - 1];
    while (
      last.length > 1 &&
      context.measureText(`${last}…`).width > maxWidth
    ) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last.trimEnd()}…`;
  }

  return lines;
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2,
) {
  const lines = wrapLines(context, text, maxWidth, maxLines);
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
  return lines.length;
}

async function loadPoster(source: string): Promise<LoadedPoster> {
  let objectUrl: string | null = null;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(source, {
      mode: 'cors',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Poster request failed');
    objectUrl = URL.createObjectURL(await response.blob());
    const image = new window.Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    return {
      image,
      cleanup: () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      },
    };
  } catch {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    return { image: null, cleanup: () => undefined };
  } finally {
    window.clearTimeout(timeout);
  }
}

async function loadTopPosters(items: ExportRankingItem[]) {
  return Promise.all(
    items.slice(0, 5).map((item) => loadPoster(item.movie.poster)),
  );
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function drawPosterTile(
  context: CanvasRenderingContext2D,
  item: ExportRankingItem,
  poster: HTMLImageElement | null,
  x: number,
  y: number,
  width: number,
  height: number,
  prominent = false,
) {
  const radius = prominent ? 20 : 15;
  context.save();
  roundedRectPath(context, x, y, width, height, radius);
  context.clip();

  context.fillStyle = COLORS.surface;
  context.fillRect(x, y, width, height);
  if (poster) {
    drawCoverImage(context, poster, x, y, width, height);
  } else {
    const fallback = context.createLinearGradient(x, y, x + width, y + height);
    fallback.addColorStop(0, '#2f1b1b');
    fallback.addColorStop(1, '#181414');
    context.fillStyle = fallback;
    context.fillRect(x, y, width, height);
    context.fillStyle = COLORS.muted;
    context.font = `700 ${prominent ? 22 : 16}px ${SANS_FONT}`;
    context.textAlign = 'center';
    context.fillText('POSTER UNAVAILABLE', x + width / 2, y + height / 2);
  }

  const shade = context.createLinearGradient(
    x,
    y + height * 0.38,
    x,
    y + height,
  );
  shade.addColorStop(0, 'rgba(8, 6, 6, 0)');
  shade.addColorStop(0.58, 'rgba(8, 6, 6, 0.54)');
  shade.addColorStop(1, 'rgba(8, 6, 6, 0.98)');
  context.fillStyle = shade;
  context.fillRect(x, y, width, height);

  const rankLabel = String(item.rank).padStart(2, '0');
  const badgeWidth = prominent ? 104 : 66;
  const badgeHeight = prominent ? 62 : 42;
  const badgeX = x + (prominent ? 20 : 14);
  const badgeY = y + (prominent ? 20 : 14);
  roundedRectPath(
    context,
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    prominent ? 10 : 8,
  );
  context.fillStyle = 'rgba(17, 14, 14, 0.9)';
  context.fill();
  context.strokeStyle = 'rgba(230, 75, 66, 0.9)';
  context.lineWidth = prominent ? 2.5 : 2;
  context.stroke();

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = COLORS.primary;
  context.font = `400 ${prominent ? 42 : 27}px ${WORDMARK_FONT}`;
  context.fillText(
    rankLabel,
    badgeX + badgeWidth / 2,
    badgeY + badgeHeight / 2 + 1,
  );

  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.fillStyle = COLORS.foreground;
  context.font = `400 ${prominent ? 34 : 22}px ${DISPLAY_FONT}`;
  const titleY = y + height - (prominent ? 78 : 54);
  drawWrappedText(
    context,
    item.movie.title,
    x + 22,
    titleY,
    width - 44,
    prominent ? 36 : 24,
    2,
  );

  if (item.tied) {
    context.fillStyle = COLORS.muted;
    context.font = `700 ${prominent ? 17 : 13}px ${SANS_FONT}`;
    context.fillText('TIED', x + 22, y + height - 24);
  }
  context.restore();

  context.save();
  roundedRectPath(context, x, y, width, height, radius);
  context.strokeStyle = COLORS.border;
  context.lineWidth = 2;
  context.stroke();
  context.restore();
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, width, height);
  const glow = context.createRadialGradient(
    width * 0.48,
    -height * 0.05,
    10,
    width * 0.48,
    -height * 0.05,
    height * 0.6,
  );
  glow.addColorStop(0, 'rgba(125, 39, 32, 0.28)');
  glow.addColorStop(1, 'rgba(17, 14, 14, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function drawWordmark(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
) {
  context.textAlign = 'left';
  context.fillStyle = COLORS.foreground;
  context.font = `400 ${31 * scale}px ${WORDMARK_FONT}`;
  context.fillText('SCREEN', x, y);
  let cursor = x + context.measureText('SCREEN').width + 9 * scale;
  context.fillStyle = COLORS.primary;
  context.font = `400 ${31 * scale}px ${WORDMARK_FONT}`;
  context.fillText('/', cursor, y);
  cursor += context.measureText('/').width + 9 * scale;
  context.fillStyle = COLORS.foreground;
  context.fillText('RANKING', cursor, y);
}

function drawHeader(
  context: CanvasRenderingContext2D,
  width: number,
  listName: string,
  movieCount: number,
  decisionCount: number,
  compact = false,
) {
  const margin = compact ? 64 : 90;
  const scale = compact ? 1 : 1.3;
  drawWordmark(context, margin, compact ? 90 : 118, scale);

  context.textAlign = 'right';
  context.fillStyle = COLORS.muted;
  context.font = `700 ${compact ? 17 : 22}px ${SANS_FONT}`;
  context.fillText(listName.toUpperCase(), width - margin, compact ? 79 : 100);
  context.font = `500 ${compact ? 14 : 18}px ${SANS_FONT}`;
  context.fillText(
    `${movieCount} MOVIES · ${decisionCount} DECISIONS`,
    width - margin,
    compact ? 105 : 132,
  );

  context.strokeStyle = COLORS.border;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(margin, compact ? 136 : 172);
  context.lineTo(width - margin, compact ? 136 : 172);
  context.stroke();

  context.textAlign = 'left';
  context.fillStyle = COLORS.foreground;
  context.font = `italic ${compact ? 72 : 92}px ${ITALIC_FONT}`;
  context.fillText('My movie ranking', margin, compact ? 229 : 288);
}

function drawListItem(
  context: CanvasRenderingContext2D,
  item: ExportRankingItem,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  lineHeight: number,
) {
  context.textAlign = 'left';
  context.fillStyle = COLORS.primary;
  context.font = `400 ${fontSize + 3}px ${DISPLAY_FONT}`;
  context.fillText(item.tied ? `T${item.rank}` : String(item.rank), x, y);

  context.fillStyle = COLORS.foreground;
  context.font = `400 ${fontSize}px ${DISPLAY_FONT}`;
  drawWrappedText(
    context,
    item.movie.title,
    x + (fontSize > 25 ? 62 : 48),
    y,
    width - (fontSize > 25 ? 62 : 48),
    lineHeight,
    2,
  );
}

function drawFooter(
  context: CanvasRenderingContext2D,
  width: number,
  y: number,
  margin: number,
  fontSize: number,
) {
  context.strokeStyle = COLORS.border;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(margin, y);
  context.lineTo(width - margin, y);
  context.stroke();

  context.textAlign = 'left';
  context.fillStyle = COLORS.foreground;
  context.font = `700 ${fontSize}px ${SANS_FONT}`;
  context.fillText('SCREENRANKING.COM', margin, y + fontSize * 2.4);
  context.textAlign = 'right';
  context.fillStyle = COLORS.muted;
  context.font = `500 ${fontSize - 2}px ${SANS_FONT}`;
  context.fillText(
    'CHOOSE BETWEEN TWO. FIND YOUR FAVORITE.',
    width - margin,
    y + fontSize * 2.4,
  );
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create image'));
    }, 'image/png');
  });
}

async function readyFonts() {
  await document.fonts.ready;
  await Promise.allSettled([
    document.fonts.load(`32px ${WORDMARK_FONT}`),
    document.fonts.load(`italic 72px ${ITALIC_FONT}`),
  ]);
}

export async function createTopTwentyCard({
  ranking,
  listName,
  movieCount,
  decisionCount,
}: {
  ranking: ExportRankingItem[];
  listName: string;
  movieCount: number;
  decisionCount: number;
}) {
  await readyFonts();
  const posters = await loadTopPosters(ranking);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');

  try {
    drawBackground(context, canvas.width, canvas.height);
    drawHeader(
      context,
      canvas.width,
      listName,
      movieCount,
      decisionCount,
      true,
    );

    const posterY = 292;
    drawPosterTile(
      context,
      ranking[0],
      posters[0]?.image ?? null,
      64,
      posterY,
      456,
      684,
      true,
    );

    const smallWidth = 220;
    const smallHeight = 330;
    const smallPositions = [
      [544, posterY],
      [796, posterY],
      [544, posterY + 354],
      [796, posterY + 354],
    ];
    ranking.slice(1, 5).forEach((item, index) => {
      const [x, y] = smallPositions[index];
      drawPosterTile(
        context,
        item,
        posters[index + 1]?.image ?? null,
        x,
        y,
        smallWidth,
        smallHeight,
      );
    });

    context.strokeStyle = COLORS.border;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(64, 1042);
    context.lineTo(1016, 1042);
    context.stroke();
    context.fillStyle = COLORS.muted;
    context.font = `700 17px ${SANS_FONT}`;
    context.fillText('THE REST OF THE TOP 20', 64, 1090);

    const textItems = ranking.slice(5, 20);
    const columnX = [64, 390, 716];
    textItems.forEach((item, index) => {
      const column = Math.floor(index / 5);
      const row = index % 5;
      drawListItem(
        context,
        item,
        columnX[column],
        1150 + row * 108,
        286,
        25,
        28,
      );
    });

    drawFooter(context, canvas.width, 1772, 64, 18);
    return await canvasToBlob(canvas);
  } finally {
    posters.forEach((poster) => poster.cleanup());
  }
}

export async function createFullRankingCard({
  ranking,
  listName,
  movieCount,
  decisionCount,
}: {
  ranking: ExportRankingItem[];
  listName: string;
  movieCount: number;
  decisionCount: number;
}) {
  await readyFonts();
  const posters = await loadTopPosters(ranking);
  const listItems = ranking.slice(5);
  const columns = 4;
  const rowsPerColumn = Math.ceil(listItems.length / columns);
  const rowHeight = 78;
  const listTop = 930;
  const footerTop = listTop + rowsPerColumn * rowHeight + 70;
  const canvas = document.createElement('canvas');
  canvas.width = 1800;
  canvas.height = footerTop + 170;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');

  try {
    drawBackground(context, canvas.width, canvas.height);
    drawHeader(context, canvas.width, listName, movieCount, decisionCount);

    const margin = 90;
    const gap = 18;
    const posterWidth = (canvas.width - margin * 2 - gap * 4) / 5;
    const posterHeight = posterWidth * 1.5;
    ranking.slice(0, 5).forEach((item, index) => {
      drawPosterTile(
        context,
        item,
        posters[index]?.image ?? null,
        margin + index * (posterWidth + gap),
        338,
        posterWidth,
        posterHeight,
      );
    });

    context.fillStyle = COLORS.muted;
    context.font = `700 21px ${SANS_FONT}`;
    context.fillText('THE COMPLETE LIST', margin, 875);

    const columnGap = 38;
    const columnWidth =
      (canvas.width - margin * 2 - columnGap * (columns - 1)) / columns;
    for (let column = 0; column < columns; column += 1) {
      const x = margin + column * (columnWidth + columnGap);
      const columnItems = listItems.slice(
        column * rowsPerColumn,
        (column + 1) * rowsPerColumn,
      );
      columnItems.forEach((item, row) => {
        const y = listTop + row * rowHeight;
        drawListItem(context, item, x, y, columnWidth, 27, 30);
        context.strokeStyle = COLORS.border;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, y + 48);
        context.lineTo(x + columnWidth, y + 48);
        context.stroke();
      });
    }

    drawFooter(context, canvas.width, footerTop, margin, 23);
    return await canvasToBlob(canvas);
  } finally {
    posters.forEach((poster) => poster.cleanup());
  }
}

export function downloadRankingImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
