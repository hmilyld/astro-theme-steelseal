/**
 * 站点身份 —— 改这一个文件就够了。
 *
 * 左栏、页头、RSS、sitemap、JSON-LD、页脚都从这里读。
 * 颜色、字体、宽度、间距这些「设计参数」在 src/styles/global.css 的 :root 里。
 */
export const SITE = {
  /** 站点名：出现在 <title> 后缀、og:site_name、左栏 h1 */
  title: '钢印日记',

  /** 拉丁字标：左栏名字下面那行，以 0.26em 字距排开 */
  latin: 'STEELSEAL',

  /** 站点副标题：meta description 与 RSS 描述 */
  description: '钢板底、铁黑字、朱红印——一套安静的写作主题',

  /** 作者名：JSON-LD、RSS、页脚版权 */
  author: '示例作者',

  /** 印章里那个字。一个汉字，衬线粗体，朱红底 */
  seal: '印',

  /** 左栏标语，一到两行 */
  tagline: '写代码，做工具，偶尔写点东西。',

  /** 左栏地点行，可以删掉 */
  place: '河南 · 周口 · 沈丘',

  /** 站点图标 */
  favicon: '/favicon.svg',

  /** 作者主页与社交链接，进 JSON-LD 的 sameAs */
  socials: ['https://github.com/yourname'],

  /**
   * 左栏底部的页面导航。
   * `key` 用来查 BaseLayout 里的 i18n 词典（nav.search / nav.links / nav.about），
   * `zh` 是服务端渲染的中文默认值，`en` 是切到英文后显示的小标。
   */
  nav: [
    { key: 'search', href: '/search', zh: '搜索', en: 'Search' },
    { key: 'links', href: '/links', zh: '链接', en: 'Links' },
    { key: 'about', href: '/about', zh: '关于', en: 'Profile' },
  ],
};
