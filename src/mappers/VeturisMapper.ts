import { 
  IStandardSearchRequest, 
  IStandardSearchResponse, 
  IStandardResult,
  IDetailsRequest,
  IDetailsResponse,
  IStandardBookRequest,
  IStandardBookResponse,
  ICancelRequest,
  ICancelResponse,
  IListBookingsRequest
} from '../interfaces';
import { IVeturisXMLSearchBody, IVeturisXMLRoom } from '../interfaces/veturis/IVeturisSearchRequest';
import { IVeturisXMLSearchResponse, IVeturisXMLHotelResponse } from '../interfaces/veturis/IVeturisSearchResponse';
import { IVeturisXMLAdditionalInfoRQ, IVeturisXMLAdditionalInfoRS } from '../interfaces/veturis/IVeturisAdditionalInfo';
import { IVeturisXMLBookRQ, IVeturisXMLBookRS } from '../interfaces/veturis/IVeturisBook';
import { IVeturisXMLCancelRQ, IVeturisXMLCancelRS } from '../interfaces/veturis/IVeturisCancel';
import { IVeturisXMLListRQ, IVeturisXMLListRS } from '../interfaces/veturis/IVeturisList';
import { XmlUtils } from './XmlUtils';

import { BoardMapper } from '../catalog/veturis/BoardMapper';

/**
 * VeturisMapper.ts
 * Implementa la interpolación estricta dictada por el skill `field-mapper`
 * para el proveedor Veturis.
 */
/**
 * VeturisMapper
 * 
 * Traductor para la API XML de Veturis.
 * Gestiona el mapeo de los tokens dinámicos 'obj' (SessionID) y 'DATOS' (Token de tarifa)
 * necesarios para la persistencia entre búsqueda y confirmación.
 */
export class VeturisMapper {
  
  /**
   * Transforma el request estándar universal en la estructura anidada nativa Veturis.
   */
  public static mapSearchRequest(req: IStandardSearchRequest): IVeturisXMLSearchBody {
    // 1. Mapeo Estratégico de Ocupación (G-Age: Niños = 0-17 años)
    if (req.occupancy.length > 5) {
      throw new Error('VeturisLimit: Máximo 5 habitaciones por petición.');
    }
    for (const occ of req.occupancy) {
      const totalChildren = (occ.childrenAges?.length || 0);
      if (occ.adults > 6 || totalChildren > 3) {
        throw new Error('VeturisLimit: Capacidad máxima excedida por habitación (6A/3C).');
      }
    }

    const rooms: IVeturisXMLRoom[] = req.occupancy.map(occ => {
      const room: IVeturisXMLRoom = { Adults: occ.adults };
      if (occ.childrenAges && occ.childrenAges.length > 0) {
        room.Children = occ.childrenAges.length;
        room.Ages = { Age: occ.childrenAges };
      }
      return room;
    });

    const formatDateSearch = (isoDate?: string) => {
      if (!isoDate || isoDate.length < 10) return '';
      const [y, m, d] = isoDate.split('-');
      return `${d}/${m}/${y}`;
    };

    // 2. Transposición Directa (Formato V3.9 - Auditoría Cruzada)
    return {
      SearchAvailabilityRQ: {
        "@_version": "2.0",
        "@_language": "SPA",
        HotelInformation: 'Y',
        Check_in_date: formatDateSearch(req.checkIn),
        Check_out_date: formatDateSearch(req.checkOut),
        Language: 'SPA',
        Currency: 'EUR',
        CountryCode: req.extraData?.countryCode || 'ESP',
        // Si el estándar envía un destino, se mapea a CityCode (G-Audit)
        CityCode: req.providerIds.length === 1 ? req.providerIds[0] : undefined,
        HotelList: req.providerIds.length > 1 ? req.providerIds.join('/') : undefined, 
        TimeLimit: 12, // G4: Segundos para truncar búsqueda (Evitar timeout 504)
        Room: rooms
      }
    };
  }

  /**
   * Absorbe el JSON estructurado (resultado del fast-xml-parser) y unifica hacia
   * el modelo de salida estandarizado IStandardSearchResponse.
   * Veturis V3.9: Hotel > Accommodations > Room > Board > DATOS.
   */
  public static mapSearchResponse(xmlObj: any): IStandardSearchResponse {
    const rs = xmlObj.SearchAvailabilityRS || xmlObj;
    const items: IStandardResult[] = [];
    
    // G-Audit: Fail-Fast Maestro (ERROR 1)
    if (rs.ERROR === "1" || rs.err || rs.ErrorCode === "1") {
      return { providerName: 'veturis', items: [] }; // No poblamos si hay error maestro
    }

    // G9: Evitar crash si no hay SessionID en búsquedas vacías
    const sessionId = rs.obj || rs.SessionId || '';

    if (!rs.HotelList || !rs.HotelList.Hotel) {
      return { providerName: 'veturis', items: [] };
    }

    const hotels = Array.isArray(rs.HotelList.Hotel) 
      ? rs.HotelList.Hotel 
      : [rs.HotelList.Hotel];

    for (const h of hotels) {
      const hotelId = h.Id;
      // G8: Truncar nombre de hotel a 50 car.
      const rawName = h.HotelDetails?.Name || `Hotel Veturis ID: ${hotelId}`;
      const hotelName = rawName.substring(0, 50);
      const photoUrl = h.HotelDetails?.Photo?.URL;

      if (!h.Accommodations || !h.Accommodations.Room) continue;

      const rooms = Array.isArray(h.Accommodations.Room)
        ? h.Accommodations.Room
        : [h.Accommodations.Room];

      for (const r of rooms) {
        if (!r.Board) continue;

        const boards = Array.isArray(r.Board) ? r.Board : [r.Board];

        const amenities = r.RoomType?.Amenities?.Amenity;
        const amenitiesList = Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []);
        // G8: Separador de amenidades debe ser guion medio
        const sortedAmenityIds = amenitiesList.map(a => a.ID).sort().join('-');
        
        // GAP: Siempre incluir guion bajo aunque no haya amenities
        const roomTypeId = sortedAmenityIds ? `${r.RoomType?.ID}_${sortedAmenityIds}` : `${r.RoomType?.ID || 'standard'}_`;

        // G9: Escalar disponibilidad si Veturis agrupa por NumberRooms
        const numRooms = parseInt(r.NumberRooms?.toString() || '1');

        for (const b of boards) {
          // Parsing Financiero (Inmutabilidad Financiera G7)
          const netPrice = parseFloat(b.PriceAgency);
          let grossPrice = netPrice;
          let isBindingRate = false;

          if (typeof b.Price === 'object' && b.Price !== null) {
            const textValue = (b.Price as any)['#text'];
            grossPrice = textValue ? parseFloat(textValue) : netPrice;
            if ((b.Price as any)['@_mandatory'] === '1') {
              isBindingRate = true;
            }
          } else if (b.Price) {
            grossPrice = parseFloat(b.Price.toString());
          }

          const result: IStandardResult = {
            providerItemId: hotelId,
            itemName: hotelName,
            photoUrl,
            bookingToken: `${sessionId}|${b.DATOS}`,
            roomType: r.RoomType ? { id: roomTypeId, name: r.RoomType.Name.substring(0, 50) } : undefined,
            boardTypeCode: b.Board_type?.ID,
            boardTypeName: BoardMapper.getName(b.Board_type?.ID || ''),
            refundable: b.Refundable === 'Y',
            pricing: {
              netPrice,
              grossPrice,
              currency: b.Currency || 'EUR',
              isDirectPayment: b.DirectPayment === '1',
              isBindingRate
            },
            cancellationPolicy: {} // Search policies are non-binding (G3.9)
          };

          items.push(result);
          
          // Nota: Si numRooms > 1, el Centralizador decidirá si mostrar N habitaciones 
          // o gestionar el inventario agrupado. Aquí exponemos la unidad base.
        }
      }
    }

    return {
      providerName: 'veturis',
      items
    };
  }

  /**
   * Mapeo para AdditionalInformation (Pre-Reserva)
   */
  public static mapDetailsRequest(req: IDetailsRequest): IVeturisXMLAdditionalInfoRQ {
    const [obj, datos] = req.bookingToken.split('|');
    return {
      AdditionalInformationRQ: {
        "@_version": "3.8", // Paso 2 requiere 3.8
        "@_language": "SPA",
        obj: obj || '',
        DATOS: datos || req.bookingToken,
        Language: 'SPA'
      }
    };
  }

  public static mapDetailsResponse(xmlObj: IVeturisXMLAdditionalInfoRS): IDetailsResponse {
    const rs = xmlObj.AdditionalInformationRS;

    // G-Audit: Fail-Fast Maestro (ERROR 1)
    if (rs.ERROR === "1" || rs.ErrorCode === "1") {
       throw new Error(`VeturisFastFail: ${JSON.stringify(rs.Errors?.Error || 'Fallo en Paso 2 (Precio/Disponibilidad)')}`);
    }

    const netPrice = parseFloat(rs.PriceAgency);

    // 1. Parsing de Información Esencial (Tramos de texto)
    let essentialInfoStr: string | undefined = undefined;
    let hasPackageRateAlert = false;
    if (rs.EssentialInformation && rs.EssentialInformation.Information) {
      const infos = Array.isArray(rs.EssentialInformation.Information)
        ? rs.EssentialInformation.Information
        : [rs.EssentialInformation.Information];
      essentialInfoStr = infos.map(i => i.Description).join(' | ');
      // G7: Alerta de tarifas empaquetadas
      if (essentialInfoStr.toLowerCase().includes('package')) {
        hasPackageRateAlert = true;
      }
    }

    // G12: Capturar política de cancelación con horas y matriz completa (G10/G12)
    const policies = rs.CancellationPolicies?.CancellationPolicy || rs.Cancellation?.Period;
    const policiesList = Array.isArray(policies) ? policies : (policies ? [policies] : []);
    const penaltyTiers = policiesList.map(p => {
      // G-Audit: Ignorar NetPrice (deprecated), usar Price o Amount
      const amountAttr = p.Price || p.Amount || '0';
      const amount = typeof amountAttr === 'string' ? parseFloat(amountAttr) : parseFloat((p as any).Amount || '0');
      return {
        startDate: p.FromDate || (p as any).From || '',
        startTime: p.Time || (p as any).Hour || '00:00',
        amount: isNaN(amount) ? 0 : amount
      };
    });

    // GAP: Soporte para typo 'Suplements' con una p
    const rawSuplements = rs.Supplements || rs.Suplements;
    const supplementsList = rawSuplements?.Supplement 
      ? (Array.isArray(rawSuplements.Supplement) ? rawSuplements.Supplement : [rawSuplements.Supplement])
      : [];

    return {
      item: {
        providerItemId: 'details',
        itemName: rs.HotelDetails?.Name?.substring(0, 50) || 'Hotel Veturis',
        bookingToken: `${rs.obj}|${rs.DATOS}`,
        essentialInfo: essentialInfoStr,
        roomType: rs.SearchAvailabilityDetails?.RoomName
          ? { id: 'details', name: rs.SearchAvailabilityDetails.RoomName.substring(0, 50) }
          : undefined,
        boardTypeCode: rs.SearchAvailabilityDetails?.BoardName, 
        boardTypeName: rs.SearchAvailabilityDetails?.BoardName,
        pricing: {
          netPrice, // G7: Inmutabilidad financiera (Precio final)
          grossPrice: typeof rs.Price === 'object' ? parseFloat(rs.Price["#text"]) : parseFloat(rs.Price),
          currency: rs.Currency,
          isDirectPayment: false, 
          isBindingRate: typeof rs.Price === 'object' && rs.Price["@_mandatory"] === "1"
        },
        cancellationPolicy: {
          freeCancellationUntil: rs.fechaLimiteSinGastos,
          penaltyTiers,
          timezone: 'Europe/Madrid'
        },
        metadata: {
          mandatoryPaxes: rs.MandatoryPaxes,
          priceChange: rs.PriceChange,
          agencyBalance: rs.AgencyBalance,
          packageRateAlert: hasPackageRateAlert
        }
      },
      priceChange: rs.PriceChange === '1',
      mandatoryPaxes: rs.MandatoryPaxes === 'Y',
      agencyBalance: rs.AgencyBalance ? {
        amountAvailable: parseFloat(rs.AgencyBalance.AmountAvailable)
      } : undefined,
      cancellationPolicy: {
        penaltyTiers
      },
      extraData: {
        priceChange: rs.PriceChange,
        boardName: rs.SearchAvailabilityDetails?.BoardName,
        category: this.extractText(rs.HotelDetails?.Category),
        dayOfWeek: rs.SearchAvailabilityDetails?.Check_in_day_of_week, // G10
        paymentAllowed: this.validateCredit(rs.PaymentTypes) // Fail-safe saldo SL
      }
    };
  }

  public static mapBookRequest(req: IStandardBookRequest): IVeturisXMLBookRQ {
    const [obj, datos] = req.bookingToken.split('|');
    const COUNTRY_MAP: Record<string, string> = { 'ESP': '15', 'MEX': '124', 'ARG': '10' };

    const formatDate = (isoDate?: string) => {
      if (!isoDate || isoDate.length < 10) return '';
      const [y, m, d] = isoDate.split('-');
      return `${d}/${m}/${y}`;
    };

    const getAge = (dob?: string) => {
      if (!dob) return 99;
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age;
    };

    // G8: Ensamblado de CompleteRoomName
    const roomNameBase = (req.extraData?.roomTypeName || 'Room').substring(0, 100);
    const completeRoomName = `${roomNameBase}`.substring(0, 255);

    // G-Age: Niños definidos como 0-17 años en Veturis V3.9
    const adults = req.passengers.filter(p => getAge(p.dateOfBirth) >= 18);
    const children = req.passengers.filter(p => getAge(p.dateOfBirth) >= 2 && getAge(p.dateOfBirth) < 18);
    const babies = req.passengers.filter(p => getAge(p.dateOfBirth) < 2);

    return {
      BookingConfirmationRQ: {
        "@_version": "2.0",
        "@_language": "SPA",
        obj: obj || '',
        DATOS: datos || req.bookingToken,
        // GAP: En Book es CamelCase
        CheckInDate: formatDate(req.checkIn),
        CheckOutDate: formatDate(req.checkOut),
        Customer: {
          Name: XmlUtils.sanitize(req.holder.name).substring(0, 50),
          Surname: XmlUtils.sanitize(req.holder.surname).substring(0, 50),
          Email: ""
        },
        Passengers: {
          Adults: {
            "@_number": adults.length,
            Passenger: adults.map((p, idx) => ({
              "@_id": (idx + 1).toString(), // G6: Pax ID secuencial
              Name: XmlUtils.sanitize(p.firstName).substring(0, 50),
              Surname: XmlUtils.sanitize(p.lastName).substring(0, 50),
              dateOfBirth: formatDate(p.dateOfBirth), // En Book exige DD/MM/YYYY
              countryID: "", 
              IsChild: "0",
              documentNumber: p.documentNumber?.substring(0, 15) || "",
              expirationDocumentDate: "", 
              country: COUNTRY_MAP[p.nationality || 'ESP'] || '15'
            }))
          },
          Children: children.length > 0 ? {
            "@_number": children.length,
            Child: children.map((p, idx) => ({
              "@_id": (adults.length + idx + 1).toString(),
              Name: XmlUtils.sanitize(p.firstName).substring(0, 50),
              Surname: XmlUtils.sanitize(p.lastName).substring(0, 50),
              dateOfBirth: formatDate(p.dateOfBirth),
              countryID: "",
              IsChild: "1",
              "@_Age": getAge(p.dateOfBirth).toString(),
              documentNumber: p.documentNumber?.substring(0, 15) || "",
              expirationDocumentDate: "",
              country: COUNTRY_MAP[p.nationality || 'ESP'] || '15'
            }))
          } : undefined,
          Babies: babies.length > 0 ? {
            "@_number": babies.length
          } : undefined,
          Room: [{
            // G-Audit: Redundancia de fechas obligatoria en nodo Room
            CheckInDate: formatDate(req.checkIn) || '',
            CheckOutDate: formatDate(req.checkOut) || ''
          }]
        },
        // G-Audit: Nodo de Pago Obligatorio B2B (<payment><Type>SL</Type></payment>)
        payment: {
          Type: { "#text": "SL" }
        },
        Reference: req.clientReferenceId?.substring(0, 20),
        PriceChange: req.extraData?.priceChange || "0", // G-Audit: Inyectar float exacto si existe
        comment: (req.extraData?.commentsAllow !== 'N' && req.comments) ? {
          text: XmlUtils.wrapInCDATA(XmlUtils.sanitize(req.comments))
        } : undefined,
        Language: 'SPA'
      }
    };
  }

  public static mapBookResponse(xmlObj: IVeturisXMLBookRS): IStandardBookResponse {
    const rs = xmlObj.BookingConfirmationRS;
    
    // G9: Validación Triple de Éxito (ReservationStatus=1, PaymentStatus=1, ConfirmationStatus=1)
    const isSuccess = rs.BookingID && 
                      rs.ReservationStatus === "1" && 
                      rs.PaymentStatus === "1" && 
                      rs.ConfirmationStatus === "1";

    return {
      confirmationId: rs.BookingID,
      providerName: 'veturis',
      securityCode: rs.SecurityCode,
      status: isSuccess ? 'CONFIRMED' : 'FAILED',
      extraData: {
        completeRoomName: rs.CompleteRoomName,
        otherFields: rs.OtherFields,
        rawStatus: rs.Status,
        reservationStatus: rs.ReservationStatus,
        paymentStatus: rs.PaymentStatus,
        confirmationStatus: rs.ConfirmationStatus
      }
    };
  }

  private static validateCredit(paymentTypes: any): boolean {
    if (!paymentTypes || !paymentTypes.Type) return false;
    const types = Array.isArray(paymentTypes.Type) ? paymentTypes.Type : [paymentTypes.Type];
    return types.some((t: any) => t["@_code"] === "SL");
  }

  // --- HELPERS INTERNOS ---
  private static extractText(node: any): string {
    if (!node) return "";
    if (typeof node === "string") return node;
    return node["#text"] || node["ID"] || JSON.stringify(node);
  }

  private static extractAttr(node: any, attr: string): string {
    if (!node || typeof node !== "object") return "";
    return node[`@_${attr}`] || "";
  }

  /**
   * Mapeo para Cancellation
   */
  public static mapCancelRequest(req: any): IVeturisXMLCancelRQ {
    return {
      BookingCancellationRQ: {
        "@_version": "1.0",
        "@_language": "SPA",
        Request: {
          BookingID: req.confirmationId,
          SecurityCode: req.securityCode || '',
          // G8: Permitir simulación si viene flag dryRun
          CancelConfirm: req.dryRun ? "0" : "1"
        }
      }
    };
  }

  public static mapCancelResponse(xmlObj: IVeturisXMLCancelRS): ICancelResponse {
    const rs = xmlObj.BookingCancellationRS;
    return {
      // Veturis V3.9: 'A' = Anulada, 'PA' = Pendiente de Anulación (Tratado como éxito)
      success: rs.BookingStatus === 'A' || rs.BookingStatus === 'PA',
      errorMessage: rs.ERROR !== "0" && rs.Errors ? JSON.stringify(rs.Errors) : undefined
    };
  }

  /**
   * Mapeo para BookingList
   */
  public static mapListRequest(req: IListBookingsRequest): IVeturisXMLListRQ {
    return {
      BookingListRQ: {
        Request: {
          BookingDateRange: {
            "@_type": req.status === 'C' ? "1" : "2", // Simplificación: 1=Reserva, 2=Checkin
            FromDate: req.fromDate,
            ToDate: req.toDate
          },
          BookingStatus: req.status
        }
      }
    };
  }

  public static mapListResponse(xmlObj: IVeturisXMLListRS): IStandardBookResponse[] {
    const rs = xmlObj.BookingListRS;
    if (!rs.Booking) return [];

    const bookings = Array.isArray(rs.Booking) ? rs.Booking : [rs.Booking];

    return bookings.map(b => ({
      confirmationId: b.BookingID,
      providerName: 'veturis',
      securityCode: b.SecurityCode
      // Se podrían mapear más campos si el contrato lo permite
    }));
  }
}
