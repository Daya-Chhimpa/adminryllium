/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Export static HTML for Apache/NGINX hosting
  output: 'export',

  // ✅ Folder name where build output will go
  distDir: 'build',

  // ✅ Base path matches your domain/subpath
  // Your admin runs at: http://admin.rayllium.com  (subdomain)
  // OR inside main domain path like http://rayllium.com/admin
  // Use only ONE of these (depends on your hosting setup):

  // ⚙️ If using subdomain (admin.rayllium.com)
  basePath: '',
  assetPrefix: '',

  // ⚙️ If using subfolder (rayllium.com/admin)
  // basePath: '/rayllium/admin',
  // assetPrefix: '/rayllium/admin/',

  // ✅ Avoid Next.js trace errors on servers
  outputFileTracing: false,

  // ✅ Skip lint/type errors during build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Disable image optimization for static export
  images: { unoptimized: true },

  // ✅ Important for correct routing in static hosting
  trailingSlash: true,
};

export default nextConfig;
