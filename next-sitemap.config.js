/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://apforges.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/api/*", "/debug"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/debug"],
      },
    ],
  },
  transform: async (config, path) => {
    const authPages = new Set(["/sign-in", "/sign-up"]);
    const priority = path === "/" ? 1 : authPages.has(path) ? 0.4 : 0.7;

    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
