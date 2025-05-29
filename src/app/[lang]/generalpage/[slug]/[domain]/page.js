import { getPageBySlug, getArticles, getCustomRecommendations } from '../../../../../lib/api/index';
import { notFound } from 'next/navigation';
import { ClientWrapper } from '../../../../../components/layouts/client-wrapper';
import CommonLayout from '../../../../../components/layouts/layout';
import Script from 'next/script'

// 添加这个配置来启用动态路由
export const dynamic = 'force-static'

// 如果需要的话，也可以添加这个配置来处理不同的域名
export const dynamicParams = true

// 添加缓存控制
export const revalidate = 0;

// 主页面组件
export default async function ArticlePage({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang, slug, domain } = resolvedParams;
    console.log('resolvedParams', resolvedParams)
    
    const articleData = await getPageBySlug(slug, lang, domain);

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

    return (
      <>
        <Script id="article-schema" type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </Script>
        <ClientWrapper>
          <main className="flex-grow">
            <CommonLayout article={article} />
          </main>
        </ClientWrapper>
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
    const { lang = 'en', slug, domain } = resolvedParams;
    
    const articleData = await getPageBySlug(slug, lang, domain);
    
    if (!articleData?.data) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
      };
    }

    const article = articleData.data;
    return {
      title: article.title, 
      description: article.description,
      keywords: joinArrayWithComma(article.pageStats?.genKeywords),
      robots: 'index, follow',
      openGraph: { 
        title: article.title,
        description: article.description,
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
        description: article.description,
        images: article.coverImage,
        creator: ''
      },
      alternates: {
        canonical: `https://${domain}/${lang}/${slug}`,
        languages: {
          'en': `https://${domain}/en/${slug}`,
          'zh': `https://${domain}/zh/${slug}`,
        }
      },
      metadataBase: new URL(`https://${domain}`),
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

// generateStaticParams 只预生成语言和 slug 的组合
export async function generateStaticParams() {
  try {
    const response = await getArticles(process.env.CUSTOMER_ID, process.env.TOKEN);
    
    if (!response?.data) {
      return [];
    }

    const validArticles = response.data.filter(article => 
      article && 
      typeof article.lang === 'string' && 
      typeof article.pageLangId === 'string'
    );

    return validArticles.map((article) => ({
      lang: article.lang,
      slug: article.pageLangId
    }));
  } catch (error) {
    return []; 
  }
}
