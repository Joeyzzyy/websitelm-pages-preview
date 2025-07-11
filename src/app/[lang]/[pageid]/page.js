import { getPageBySlug, getArticles } from '../../../lib/api/index';
import { notFound } from 'next/navigation';
import { ClientWrapper } from '../../../components/layouts/client-wrapper';
import CommonLayout from '../../../components/layouts/layout';
import Script from 'next/script'
import { JSDOM } from 'jsdom';

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

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang = 'en', pageid } = resolvedParams;
    
    const articleData = await getPageBySlug(pageid, lang);

    // 兜底
    if (!articleData?.data) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
      };
    }

    // 这里假设 articleData.data.html 就是完整 HTML 字符串
    const htmlString = articleData.data.html;
    if (!htmlString) {
      // 没有 html 字段时，走原有逻辑
      return {
        title: articleData.data.title,
        description: articleData.data.description
      };
    }

    // 用 jsdom 解析 html 字符串
    const dom = new JSDOM(htmlString);
    const { document } = dom.window;

    const title = document.querySelector('title')?.textContent || articleData.data.title || '';
    const description = document.querySelector('meta[name="description"]')?.content || articleData.data.description || '';
    const keywords = document.querySelector('meta[name="keywords"]')?.content || '';
    // 你可以继续提取 og、twitter 等 meta

    return {
      title,
      description,
      keywords,
      // 你可以继续补充 openGraph、twitter 等
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
