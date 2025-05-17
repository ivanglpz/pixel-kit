import fs from "fs";
import { join } from "path";

const pagepaths = ["/", "/editor", "/draw"];

function splitArrayIntoParts<T>(array: T[], parts: number) {
  const partSize = Math.ceil(array.length / parts);
  return Array.from({ length: parts }, (_, index) =>
    array.slice(index * partSize, (index + 1) * partSize)
  );
}

const ENDPOINT_URL = "https://pixel-kit.vercel.app";

const START_SITEMAP_URLSET = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

const END_SITEMAP_URLSET = `
</urlset>`;

type Options = {
  changefreq: "daily";
  priority: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
};

function createSitemaps(paths: string[], props: Options) {
  const sitemaps = splitArrayIntoParts(paths, 1);

  const { changefreq = "daily", priority = 0.5 } = props;

  const lastmod = new Date().toISOString();

  const xmls = sitemaps?.map((paths) => {
    const urlset = paths
      .map((path) => {
        return `<url><loc>${ENDPOINT_URL}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${path === "/" ? "1.0" : priority}</priority></url>`;
      })
      .join("");
    return START_SITEMAP_URLSET + urlset + END_SITEMAP_URLSET;
  });

  return xmls;
}

const START_SITEMAP_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const END_SITEMAP_INDEX = `
</sitemapindex>`;

const createMainSitemap = (nSitemaps: number) => {
  const urlset = Array.from({ length: nSitemaps }, (_, index) => index)
    .map((index) => {
      return `<sitemap><loc>${ENDPOINT_URL}/sitemap-${index}.xml</loc></sitemap>`;
    })
    .join("");
  return START_SITEMAP_INDEX + urlset + END_SITEMAP_INDEX;
};

const normalizeSlug = (value: string) => value?.split?.("\r")?.[0];

const handle = async () => {
  const mainSitemap = createMainSitemap(1);

  const pathMainSitemap = join(process.cwd(), "public", `sitemap.xml`);
  fs.writeFile(pathMainSitemap, mainSitemap, (err) => {
    if (err) {
      console.error("Error al escribir el archivo sitemap.xml:", err);
    } else {
      console.log(`Sitemap main XML creado exitosamente.`);
    }
  });

  const sitemaps = createSitemaps(pagepaths, {
    changefreq: "daily",
    priority: 0.6,
  });

  for (let index = 0; index < sitemaps.length; index++) {
    const path = join(process.cwd(), "public", `sitemap-${index}.xml`);
    fs.writeFile(path, sitemaps[index], (err) => {
      if (err) {
        console.error("Error al escribir el archivo sitemap.xml:", err);
      } else {
        console.log(`Sitemap ${index + 1} XML creado exitosamente.`);
      }
    });
  }
};
handle();
