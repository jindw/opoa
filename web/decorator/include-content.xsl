<?xml version = '1.0' encoding = 'utf-8' ?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <table>
      <tr>
        <td>
          <xsl:text>标题文本:</xsl:text>
        </td>
        <td>
          <xsl:value-of select="//h3" />
        </td>
      </tr>
      <tr>
        <td>
          <xsl:text>内容文本</xsl:text>
        </td>
        <td>
          <ul>
            <xsl:for-each select="//p">
              <li>
                <xsl:value-of select="." />
              </li>
            </xsl:for-each>
          </ul>
        </td>
      </tr>
    </table>
  </xsl:template>
</xsl:stylesheet>