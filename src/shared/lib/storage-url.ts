/**
 * @module storage-url
 *
 * Rewrites internal MinIO container URLs (`minio:9000`) to browser-accessible
 * origins. Only the URL host is modified; path segments are preserved.
 */

/** Docker-internal MinIO hostname used by backend services. */
const INTERNAL_MINIO_ORIGIN = 'minio:9000';

/**
 * Resolves the browser-accessible MinIO origin for the current environment.
 *
 * @returns `localhost:9000` in development; `NEXT_PUBLIC_MINIO_URL` or the
 *          default public domain in production.
 */
function getPublicMinioOrigin(): string {
    if (process.env.NODE_ENV === 'development') {
        return 'localhost:9000';
    }
    return (
        process.env.NEXT_PUBLIC_MINIO_URL ||
        'minio.esg-ai.wankaew.com'
    );
}

/**
 * Replaces the internal MinIO host (`minio:9000`) with the browser-accessible
 * origin. Path segments containing "minio" are left untouched.
 *
 * @param url - Absolute MinIO URL (e.g. `http://minio:9000/bucket/file.csv`).
 * @returns   The rewritten URL, or an empty string if `url` is falsy.
 *
 * @example
 * normalizeStorageUrl('http://minio:9000/bucket/minio-reports/file.csv');
 * // dev  → 'http://localhost:9000/bucket/minio-reports/file.csv'
 * // prod → 'http://minio.esg-ai.wankaew.com/bucket/minio-reports/file.csv'
 */
export function normalizeStorageUrl(url: string): string {
    if (!url) return '';

    try {
        const parsed = new URL(url);
        const publicOrigin = getPublicMinioOrigin();

        if (parsed.host === INTERNAL_MINIO_ORIGIN) {
            const [host, port] = publicOrigin.split(':');
            parsed.hostname = host;
            parsed.port = port ?? '';

            // Avoid an explicit `:80` when no port is configured.
            if (!port && parsed.protocol === 'http:') {
                parsed.port = '';
            }
        }

        return parsed.toString();
    } catch {
        // Fallback for non-parseable URLs — scope replacement to the origin only.
        const publicOrigin = getPublicMinioOrigin();
        return url.replace(`//${INTERNAL_MINIO_ORIGIN}`, `//${publicOrigin}`);
    }
}
