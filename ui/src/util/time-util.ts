export function formatMilliseconds(ms: number): string {
  let h, m, s;
  h = Math.floor(ms / 1000 / 60 / 60);
  m = Math.floor((ms / 1000 / 60 / 60 - h) * 60);
  s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60);
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}