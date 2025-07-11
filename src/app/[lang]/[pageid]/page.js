import { getPageBySlug, getArticles } from '../../../lib/api/index';
import { notFound } from 'next/navigation';
import { ClientWrapper } from '../../../components/layouts/client-wrapper';
import CommonLayout from '../../../components/layouts/layout';
import Script from 'next/script'

export const dynamic = 'force-static'

export const dynamicParams = true

export const revalidate = 0; 

export default async function ArticlePage({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang, pageid } = resolvedParams;
    console.log('resolvedParams', resolvedParams)
    
    const articleData = await getPageBySlug(pageid, lang);

    if (!articleData?.data) {
      return notFound();
    }
    
    const article = articleData.data;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.updatedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: article.publisher,
        logo: {
          '@type': 'ImageObject',
          url: article.publisherLogo
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
      }
    };

    if (typeof window !== 'undefined') {
      window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};
      window.__NEXT_DATA__.pageProps = { 
        ...window.__NEXT_DATA__.pageProps,
        article: JSON.parse(JSON.stringify(article)) // 深度克隆避免引用差异
      };
    }

    return (
      <>
        <Script id="article-schema" type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </Script>
          <main className="flex-grow">
            <CommonLayout article={article} />
          </main>
      </>
    );
  } catch (error) {
    throw error;
  }
}

function joinArrayWithComma(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(',') : '';
}

// 新增：从 HTML 字符串中提取 meta[name="description"] 的 content
function extractDescriptionFromHtml(html) {
  if (!html) return '';
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang = 'en', pageid } = resolvedParams;
    
    const articleData = await getPageBySlug(pageid, lang);
    
    if (!articleData?.data) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
      };
    }

    const article = articleData.data;
    // 用新函数提取 description
    const description = extractDescriptionFromHtml(article.html) || article.description;

    return {
      title: article.title, 
      description, // 用提取到的 description
      keywords: joinArrayWithComma(article.pageStats?.genKeywords),
      robots: 'index, follow',
      openGraph: { 
        title: article.title,
        description,
        type: 'article',
        publishedTime: article.updatedAt,
        modifiedTime: article.updatedAt,  
        locale: lang,
        siteName: '',
        images: [{
          url: '',
          width: 1200,
          height: 630,
          alt: article.title
        }]
      },
      twitter: { 
        card: 'summary_large_image',
        title: article.title,
        description,
        images: article.coverImage,
        creator: ''
      },
      alternates: {
        canonical: `https://your-domain.com/${lang}/${pageid}`,
        languages: {
          'en': `https://your-domain.com/en/${pageid}`,
          'zh': `https://your-domain.com/zh/${pageid}`,
        }
      },
      metadataBase: new URL(`https://your-domain.com`),
      authors: [{ name: article.author }],
      category: article.category
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while generating metadata.'
    };
  }
}

export async function generateStaticParams() {
  try {
    const response = await getArticles(process.env.CUSTOMER_ID, process.env.TOKEN);
    
    console.log('generateStaticParams response:', response);
    
    if (!response?.data) {
      console.log('No data in response');
      return [];
    }

    const validArticles = response.data.filter(article => 
      article && 
      typeof article.lang === 'string' && 
      typeof article.id === 'string'
    );

    console.log('Valid articles:', validArticles);
    
    const params = validArticles.map((article) => ({
      lang: article.lang,
      pageid: article.id
    }));

    console.log('Generated params:', params);
    return params;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return []; 
  }
}
