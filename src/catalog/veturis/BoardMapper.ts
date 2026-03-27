/**
 * BoardMapper.ts (Veturis)
 * Mapea códigos numéricos de régimen de Veturis a texto legible.
 * Sigue el catálogo oficial de Veturis.
 */
export class BoardMapper {
  private static readonly BOARDS: Record<string, string> = {
    '1': 'Solo Alojamiento',
    '2': 'Alojamiento y Desayuno',
    '3': 'Media Pensión',
    '4': 'Pensión Completa',
    '5': 'Todo InclUIDo',
    '15': 'Media Pensión Bebidas InclUIDas',
    '16': 'Pensión Completa Bebidas InclUIDas',
  };

  /**
   * Retorna el nombre del régimen o el código si no existe mapeo.
   */
  public static getName(id: string): string {
    return this.BOARDS[id] || `Régimen ID: ${id}`;
  }
}
