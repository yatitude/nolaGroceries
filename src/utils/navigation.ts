// Utility for handling navigation in static deployments
export function getRelativePath(path: string): string {
  // Remove leading slash for relative paths
  return path.startsWith('/') ? path.slice(1) : path;
}

export function navigateTo(path: string): void {
  const relativePath = getRelativePath(path);
  // Use relative path for navigation
  window.location.href = relativePath || './';
}