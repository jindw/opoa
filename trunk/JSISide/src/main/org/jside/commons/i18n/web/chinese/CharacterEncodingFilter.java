package org.jside.commons.i18n.web.chinese;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jside.jsel.Java6JSExpressionFactory;
import org.jside.template.Template;
import org.jside.template.XMLParser;

/**
 * 语言过滤器+简繁通
 * <p>
 * Company: chenwa
 * </p>
 * 
 * @author Jindw
 * @version 1.0
 */
public final class CharacterEncodingFilter implements Filter {
    /**
     * Logger for this class
     */
    private static final Log log = LogFactory
            .getLog(CharacterEncodingFilter.class);

    public static final String KEY = CharacterEncodingFilter.class.getName()
            + ".LocaleKey";


    private String encodingSetter = "/encoding-setter.action";

    private String charset = "utf-8";

    public void output(Writer out, String template, Map context)
            throws Exception {
    	XMLParser parser = new XMLParser();
    	parser.setExpressionFactory(new Java6JSExpressionFactory());
        Template t = new Template(this.getClass().getResource(template + ".xhtml"),parser); //$NON-NLS-1$
        t.render(context, out);
        out.flush();
    }

    private boolean force = false;

    private ResponseWrapperFactory factory = null;

    /**
     * 过滤器入口
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    public void doFilter(ServletRequest req, ServletResponse resp,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        request.setCharacterEncoding(charset);
        response.setCharacterEncoding(charset);
        response.setContentType("text/html;charset=" + charset);
        if (request.getAttribute(KEY) == null) {
            request.setAttribute(KEY, Boolean.TRUE);
            String path = request.getServletPath();
            if (path.equals(encodingSetter)) {
                HttpSession session = request.getSession();
                Locale locale = (Locale) session.getAttribute(KEY);
                String reqLocale = request.getParameter(KEY);
                try {
                    if (reqLocale != null) {
                        log.debug("设置区域");
                        if ("zh_CN".equals(reqLocale)) {
                            locale = Locale.CHINA;
                            session.setAttribute(KEY, locale);
                        } else if ("zh_TW".equals(reqLocale)) {
                            locale = Locale.TAIWAN;
                            session.setAttribute(KEY, locale);
                        } else {
                            locale = null;
                            session.removeAttribute(KEY);
                        }

                        HashMap map = new HashMap();
                        map.put("locale", locale == null?null:locale.toString());
                        output(response.getWriter(), "setter-success", map);
                    } else {
                        HashMap map = new HashMap();
                        map.put("locale", locale == null?null:locale.toString());
                        map.put("key", KEY);
                        output(response.getWriter(), "setter-input", map);
                    }
                } catch (Exception e) {
                    log.error("执行模版失败：", e);
                    throw new ServletException(e);
                }
            } else {
                if (path.indexOf('.') < 0 || path.endsWith(".htm")
                        || path.endsWith(".html") || path.endsWith(".jsp")) {
                    this.doCharacterEncodingFilter(request, response, chain);
                } else {
                    this.doCharacterEncodingFilter(request, response, chain);
                }
            }
        } else {
        	this.doCharacterEncodingFilter(request, response, chain);
        }
    }

    /**
     * 实现编码转换
     * @param request
     * @param response
     * @param chain
     * @throws IOException
     * @throws ServletException
     */
    public void doCharacterEncodingFilter(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpSession session = request.getSession();
        Locale locale = (Locale) session.getAttribute(KEY);
        String reqLocale = request.getParameter(KEY);
        if (reqLocale != null) {
            log.debug("重新设置区域");
            if ("zh_CN".equals(reqLocale)) {
                locale = Locale.CHINA;
            } else if ("zh_TW".equals(reqLocale)) {
                locale = Locale.TAIWAN;
            }
            session.setAttribute(KEY, locale);
            response.setLocale(locale);
        } else if (force && locale == null) {
            log.debug("强制首次设置区域");
            locale = request.getLocale();
            session.setAttribute(KEY, locale);
        }
        if(log.isDebugEnabled()){
        	log.debug("开始 CharacterEncodingFilter[区域设置为：" + locale+"];URI=" +request.getRequestURI());
        }
        if (Locale.CHINA.equals(locale)) {
            HttpServletResponseWrapper wrappedResp = factory
                    .newSimplifiedWrapper(response);
            chain.doFilter(request, wrappedResp);
        } else if (Locale.TAIWAN.equals(locale)) {
            HttpServletResponseWrapper wrappedResp = factory
                    .newTraditionalWrapper(response);
            chain.doFilter(request, wrappedResp);
        } else {
            chain.doFilter(request, response);
        }
    }

    public void destroy() {
    }

    
    public void init(FilterConfig filterConfig) throws ServletException {

        log.info("初始化：" + this);
        this.force = "true".equals(filterConfig.getInitParameter("force"));
        String path = filterConfig.getInitParameter("setter-url");
        if (path != null) {
            this.encodingSetter = path;
        }
        String charsetParam = filterConfig.getInitParameter("charset");
        if (charsetParam != null) {
            this.charset = charsetParam;
        }
        try {
            this.factory = ResponseWrapperFactory.newInstance(null,
                    this.charset, this.charset);
        } catch (Throwable e) {
            log.error("初始化语言过滤工厂失败：", e);
        }
    }

}
