/**
 * XmlUtils.ts
 * Utilidades para el manejo seguro de XML.
 */

export class XmlUtils {
  /**
   * Sanitización estricta para Veturis.
   * Elimina caracteres que rompen el XML según el manual (&, /, <, >).
   */
  public static sanitize(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '')
      .replace(/\//g, '')
      .replace(/</g, '')
      .replace(/>/g, '')
      .trim();
  }

  /**
   * Envuelve una cadena en un bloque CDATA para transporte seguro de texto.
   */
  public static wrapInCDATA(str: string): string {
    if (!str) return '<![CDATA[]]>';
    return `<![CDATA[${str}]]>`;
  }
}
