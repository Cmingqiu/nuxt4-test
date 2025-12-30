/**
 * 从响应中提取文件名
 */
export function extractFilename(
  url: string,
  disposition: string | null
): string {
  if (disposition) {
    const filenameMatch = disposition.match(
      /filename\*?=['"]?(?:UTF-8'')?([^;\n"']+)/i
    );
    if (filenameMatch?.[1]) {
      return decodeURIComponent(filenameMatch[1]);
    }
  }
  return url.split('/').pop()?.split('?')[0] || 'download';
}

/**
 * 触发浏览器下载
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
