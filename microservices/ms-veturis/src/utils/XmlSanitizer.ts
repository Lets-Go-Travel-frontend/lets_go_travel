export class XmlSanitizer {
    /**
     * Sanitiza strings para cumplir con las restricciones de Veturis (Pág 35).
     * Prohíbe: &, /, >, <
     */
    public static sanitize(text: string): string {
        if (!text) return "";
        return text
            .replace(/[&><\/]/g, " ") // Reemplaza caracteres prohibidos por espacio
            .trim();
    }

    /**
     * Envuelve un texto en CDATA para máxima seguridad si contiene caracteres especiales
     * permitidos pero problemáticos para el parser XML.
     */
    public static wrapCDATA(text: string): string {
        if (!text) return "";
        return `<![CDATA[${text}]]>`;
    }
}
