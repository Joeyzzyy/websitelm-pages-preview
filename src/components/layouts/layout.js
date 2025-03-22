'use client';
import React, { useEffect, useMemo, memo, useState } from 'react';
import parse from 'html-react-parser';
import { Typography, message } from 'antd';
import Header from './header-template';
import Footer from './footer-template';
/* divider */
import HeroSectionWithVideo from '../common/sections/hero-section-with-video';
import HeroSectionWithMultipleTexts from '../common/sections/hero-section-with-multiple-texts';
/* divider */
import TitleSection from '../common/sections/title-section';
import TitleSectionWithImage from '../common/sections/title-section-with-image';
/* divider */
import WhyChooseUsWithSmallBlocks from '../common/sections/why-choose-us-with-small-blocks';
import WhyChooseUsWithBlocks from '../common/sections/why-choose-us-with-blocks';
import WhyChooseUsWithStory from '../common/sections/why-choose-us-with-story';
/* divider */
import HowItWorksWithWorkflow from '../common/sections/how-it-works-with-workflow';
import HowItWorksWithBlocks from '../common/sections/how-it-works-with-blocks';
/* divider */
import FeaturesTabbed from '../common/sections/features-tabbed';
/* divider */
import ProductBenefitsWithBlocks from '../common/sections/product-benefits-with-blocks';
import ProductBenefitsWithTable from '../common/sections/product-benefits-with-table';
/* divider */
import UserReviewsWithMovingCards from '../common/sections/user-reviews-with-moving-cards';
/* divider */
import MeetOurTeam from '../common/sections/meet-our-team';
/* divider */
import JobListNormal from '../common/sections/job-list-normal';
/* divider */
import FAQ from '../common/sections/faq-standard';
/* divider */
import CallToAction from '../common/sections/call-to-action';
import CallToActionComplex from '../common/sections/call-to-action-complex';
import CallToActionWithInput from '../common/sections/call-to-action-with-input';
/* divider */
import KeyResultsWithTextBlock from '../common/sections/key-results-with-text-block';
import KeyResultsWithImage from '../common/sections/key-results-with-image';
import KeyResultsWithCards from '../common/sections/key-results-with-cards';
/* divider */
import PageListCard from '../common/sections/page-list-card';
/* divider */
import SubscriptionCard from '../common/sections/subscription-card';
/* divider */
import FeatureComparisonTable from '../common/sections/feature-comparison-table';
/* divider */
import ProductComparisonTable from '../common/sections/product-comparison-table';
import DOMPurify from 'dompurify';

const { Paragraph, Text } = Typography;

/**
 * HTML Content Renderer Component
 * Handles and renders HTML content with editable tags
 * @param {Object} props
 * @param {string} props.content - HTML string content
 * @param {boolean} props.isEditable - Enable/disable editing functionality
 */
const HtmlRenderer = ({ content, isEditable = true }) => {
  // 新增样式内容状态
  const [styleContent, setStyleContent] = useState('');

  // 转义处理函数（添加输入输出日志）
  const unescapeHTML = (str) => {
    console.log('[unescapeHTML] 输入内容:', str);
    
    const escapeMap = {
      '\\n': '\n',  '\\t': '\t',  '\\r': '\r',
      '\\"': '"',   "\\'": "'",   '\\\\': '\\',
      '&lt;': '<', '&gt;': '>', '&amp;': '&'
    };
    
    const result = str?.replace(/\\([ntr"'\\])|&(lt|gt|amp);/g, (_, escChar, htmlEntity) => {
      if (escChar) return escapeMap[`\\${escChar}`];
      if (htmlEntity) return escapeMap[`&${htmlEntity}`];
      return _;
    }) || '';

    console.log('[unescapeHTML] 输出结果:', result);
    return result;
  };

  // 提取body和style内容（修改后的逻辑）
  const { bodyContent, extractedStyle } = useMemo(() => {
    console.log('[bodyContent] 原始内容:', content);
    
    if (!content) return { bodyContent: '', extractedStyle: '' };
    const decoded = unescapeHTML(content);
    console.log('[bodyContent] 初次解码后:', decoded);

    // 匹配body和style标签内容
    const bodyMatch = decoded.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const styleMatch = decoded.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    
    const rawBody = bodyMatch ? bodyMatch[1] : decoded;
    const rawStyle = styleMatch ? styleMatch[1] : '';

    // 公共转义处理
    const commonUnescape = (str) => str
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return {
      bodyContent: commonUnescape(rawBody),
      extractedStyle: commonUnescape(rawStyle)
    };
  }, [content]);

  // 动态插入样式（新增效果）
  useEffect(() => {
    if (extractedStyle) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = extractedStyle;
      document.head.appendChild(styleTag);
      
      // 清理函数
      return () => {
        document.head.removeChild(styleTag);
      };
    }
  }, [extractedStyle]);

  // HTML解析配置（添加节点处理日志）
  const parseOptions = useMemo(() => ({
    replace: domNode => {
      console.log('[parse] 当前处理节点:', domNode);
      
      if (isEditable && domNode.attribs?.canEdit) {
        console.log('[parse] 发现可编辑节点:', domNode);
        return (
          <EditableElement
            onChange={value => handleContentChange(domNode, value)}
            node={domNode}
          />
        );
      }
    }
  }), [isEditable]);

  // 开发环境调试输出（增强日志）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && content) {
      console.groupCollapsed('HTML处理全流程调试');
      console.log('原始HTML:', content);
      console.log('unescape处理结果:', unescapeHTML(content));
      console.log('body内容提取结果:', bodyContent);
      console.groupEnd();
    }
  }, [content, bodyContent]);

  /**
   * Handle content updates
   * @param {string} newContent - Updated content
   * @param {Object} element - Element information
   */
  const handleContentChange = async (newContent, element) => {
    try {
      // TODO: Implement save logic
      console.log('Content update:', {
        id: element.id,
        type: element.type,
        oldContent: element.content,
        newContent: newContent
      });
      
      // API call to save updated content
      // await updateContent({
      //   id: element.id,
      //   content: newContent,
      //   type: element.type
      // });
      
      message.success('Content updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      message.error('Failed to update content');
    }
  };

  return (
    <div 
      className="html-content w-full"
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
      }}
    >
      {extractedStyle && (
        <style
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(extractedStyle, {
              FORBID_TAGS: ['script', 'link'],
              FORBID_ATTR: ['onload', 'onerror']
            })
          }}
        />
      )}
      {parse(bodyContent, parseOptions)}
    </div>
  );
};

// 组件映射表，用于动态渲染不同类型的组件
const COMPONENT_MAP = {
  TitleSection: TitleSection,
  TitleSectionWithImage: TitleSectionWithImage,
  HeroSectionWithVideo: HeroSectionWithVideo,
  HeroSectionWithMultipleTexts: HeroSectionWithMultipleTexts,
  WhyChooseUsWithSmallBlocks: WhyChooseUsWithSmallBlocks,
  WhyChooseUsWithBlocks: WhyChooseUsWithBlocks,
  WhyChooseUsWithStory: WhyChooseUsWithStory,
  HowItWorksWithWorkflow: HowItWorksWithWorkflow,
  FeaturesTabbed: FeaturesTabbed,
  ProductBenefitsWithBlocks: ProductBenefitsWithBlocks,
  UserReviewsWithMovingCards: UserReviewsWithMovingCards,
  MeetOurTeam: MeetOurTeam,
  JobList: JobListNormal,
  Faqs: FAQ,
  CallToActionComplex: CallToActionComplex,
  CallToActionWithEmailInput: CallToActionWithInput,
  ProductBenefitsWithTable: ProductBenefitsWithTable,
  KeyResultsWithTextBlock: KeyResultsWithTextBlock,
  KeyResultsWithImage: KeyResultsWithImage,
  KeyResultsWithCards: KeyResultsWithCards,
  HowItWorksWithBlocks: HowItWorksWithBlocks,
  CallToAction: CallToAction,
  PageListCard: PageListCard,
  SubscriptionCard: SubscriptionCard,
  FeatureComparisonTable: FeatureComparisonTable,
  ProductComparison: ProductComparisonTable,
};

/**
 * 通用布局组件
 * 支持两种渲染模式：
 * 1. 组件拼接模式：通过sections数组渲染多个组件
 * 2. HTML直接渲染模式：渲染完整的HTML内容
 * @param {Object} props
 * @param {Object} props.article - Article data object
 */
const CommonLayout = ({ article }) => {
  // Extract header configuration from article data
  const headerData = useMemo(() => {
    return article?.pageLayout?.pageHeaders;
  }, [article?.pageLayout?.pageHeaders]);

  // Extract footer configuration from article data
  const footerData = useMemo(() => {
    return article?.pageLayout?.pageFooters;
  }, [article?.pageLayout?.pageFooters]);

  // Determine if content is complete HTML
  const isHtmlContent = article.html?.startsWith('<!DOCTYPE html>') || 
                       article.html?.startsWith('<html');

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col">
      {/* Render header */}
      {headerData && (
        <Header 
          data={headerData} 
          memo={() => JSON.stringify(headerData)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden pt-[60px]">
        {isHtmlContent ? (
          // HTML content rendering mode
          <HtmlRenderer content={article.html} />
        ) : (
          // Component concatenation rendering mode
          article.sections?.map((section, index) => {
            const Component = COMPONENT_MAP[section.componentName];
            if (!Component) return null;
            
            // Special handling for Landing Page type pages
            if (article.pageType === 'Landing Page' && section.componentName === 'TitleSection') {
              return null;
            }
            
            return (
              <div 
                key={`${section.componentName}-${section.sectionId}`}
                className="w-full bg-white"
              >
                <Component 
                  data={section}
                  author={article.author}
                  date={article.createdAt}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Render footer */}
      {footerData && (
        <Footer 
          data={footerData}
          memo={() => JSON.stringify(footerData)}
        />
      )}
    </div>
  );
};

// Use memo to optimize component performance
export default memo(CommonLayout);