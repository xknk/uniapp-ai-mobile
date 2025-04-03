import MarkdownIt from "markdown-it";
// import emoji from "markdown-it-emoji";
import deflist from "markdown-it-deflist";
import abbr from "markdown-it-abbr";
import footnote from "markdown-it-footnote";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import container from "markdown-it-container";
import toc from "markdown-it-toc-done-right";
// import mermaid from "@DatatracCorporation/markdown-it-mermaid";
import MarkdownItAnchor from "markdown-it-anchor";

export const useMarkDown = () => {
    var config = {
        html: true,
        xhtmlOut: true,
        breaks: true,
        langPrefix: "lang-",
        linkify: false,
        typographer: true,
        quotes: "“”‘’",
    };
    let markdownIt = new MarkdownIt(config);
    markdownIt.renderer.rules.hr = function () {
        return '';
    };

    // 自定义表格开始标签的渲染规则
    markdownIt.renderer.rules.table_open = function (tokens, idx, options, env, self) {
        // 在表格开始标签前添加带有指定 class 的 div 开始标签
        let result = '<div class="custom-table-wrapper">';
        result += '<table';
        if (tokens[idx].attrPush) {
            tokens[idx].attrPush(['class', 'custom-table']);
        }
        result += self.renderAttrs(tokens[idx]);
        result += '>';
        return result;
    };

    // 自定义表格结束标签的渲染规则
    markdownIt.renderer.rules.table_close = function (tokens, idx, options, env, self) {
        let result = '</table>';
        // 在表格结束标签后添加 div 结束标签
        result += '</div>';
        return result;
    };

    // 自定义 th 开始标签的渲染规则
    markdownIt.renderer.rules.th_open = function (tokens, idx, options, env, self) {
        return '<th><div class="custom-cell-wrapper">';
    };

    // 自定义 th 结束标签的渲染规则
    markdownIt.renderer.rules.th_close = function (tokens, idx, options, env, self) {
        return '</div></th>';
    };

    // 自定义 td 开始标签的渲染规则
    markdownIt.renderer.rules.td_open = function (tokens, idx, options, env, self) {
        return '<td><div class="custom-cell-wrapper">';
    };

    // 自定义 td 结束标签的渲染规则
    markdownIt.renderer.rules.td_close = function (tokens, idx, options, env, self) {
        return '</div></td>';
    };
    markdownIt
        // .use(emoji)
        .use(deflist)
        .use(abbr)
        .use(MarkdownItAnchor)
        .use(footnote)
        .use(ins)
        .use(mark)
        .use(taskLists)
        .use(container)
        .use(container, "hljs-left")
        .use(container, "hljs-center")
        .use(container, "hljs-right")
        .use(toc)
    // .use(mermaid);

    return {
        markdownIt
    }
}
