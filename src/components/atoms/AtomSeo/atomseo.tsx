import Head from "next/head";
import Script from "next/script";
import { FC } from "react";

type Props = {
  title: string;
  description: string;
  url: string;
  image: string;
  content: string;
};

const googleAnalytics = `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTIS}`;
const urlAnalytics = `https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`;

const AtomSeo: FC<Props> = ({ title, content, description, url, image }) => {
  return (
    <>
      <Script src={urlAnalytics} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${googleAnalytics}');
        `}
      </Script>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta
          name="google-site-verification"
          content="EANZjrV1t4rH8Z9sSXalLjIu6DXtsV7rNxkKtJGrxvE"
        />
        <link rel="icon" type="image/png" href={`/icon-pixel-kit.png`} />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta name="keywords" content={content} />

        {/* Googlebot settings */}
        <meta name="googlebot" content="index,follow" />

        {/* Open Graph and Twitter meta tags for social sharing */}
        <meta property="og:locale" content="es_ES" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content={image} />
        <meta property="og:image:secure_url" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />

        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content={image} />

        {/* Schema.org for Google Rich Snippets */}
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "${title}",
            "url": "${url}",
            "description": "${description}",
            "image": "${image}"
          }
        `}
        </script>
      </Head>
    </>
  );
};

export default AtomSeo;
