<?xml version = '1.0' encoding = 'utf-8' ?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <div>
      <a href="index.html">返回</a>
      <xsl:for-each select="ul/li/a">
        |
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="@href" />
          </xsl:attribute>
          <xsl:value-of select="." />
        </a>
      </xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>