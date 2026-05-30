import { toPng, toSvg } from 'html-to-image';

export async function exportToPng(element: HTMLElement, filename: string = 'architecture.png') {
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#0b0e14',
      quality: 1.0,
      pixelRatio: 2,
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export PNG:', err);
  }
}

export async function exportToSvg(element: HTMLElement, filename: string = 'architecture.svg') {
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: '#0b0e14',
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export SVG:', err);
  }
}
