export interface IVeturisRawSearchResponse {
    SearchAvailabilityRS: {
        SessionId?: string;
        HotelList?: {
            Hotel: IVeturisRawHotel | IVeturisRawHotel[];
        };
        Error?: string;
    };
}

export interface IVeturisRawHotel {
    Id: string;
    HotelDetails: {
        ID?: string;
        Id?: string;
        Name: string;
    };
    Accommodations: {
        Room: IVeturisRawRoom | IVeturisRawRoom[];
    };
}

export interface IVeturisRawRoom {
    RoomType: {
        Name: string;
        Amenities?: {
            Amenity: { ID: string } | Array<{ ID: string }>;
        };
    };
    Board: IVeturisRawBoard | IVeturisRawBoard[];
}

export interface IVeturisRawBoard {
    Board_type: {
        Name: string;
    };
    PriceAgency: string;
    Price: string | { _: string; $: { mandatory: string } };
    Currency: string;
    DATOS: string;
    Refundable: string;
    Cancellation?: {
        From: string;
        Price: string;
    };
}

/** [GDS_CONTRACT_v3_9]: Real Responses from Veturis Manual */

export interface IVeturisRawDetailsResponse {
    AdditionalInformationRS: {
        $: { currency?: string };
        SessionId?: string;
        SessionID?: string;
        obj?: string;
        HotelDetails: {
            ID: string;
            Name: string;
            Address?: string;
            City?: string;
        };
        fechaLimiteSinGastos?: string;
        Rooms: {
            Room: IVeturisDetailsRoom | IVeturisDetailsRoom[];
        };
        EssentialInformation?: {
            Information: {
                Description: string;
            } | Array<{ Description: string }>;
        };
        MandatoryPaxes?: 'Y' | 'N' | 'H';
        PriceChange?: string;
        AgencyBalance?: string;
        Error?: string;
        ERROR?: string;
        PriceAgency: string;
    };
}

export interface IVeturisDetailsRoom {
    Refundable: string;
    Cancellation: {
        Period: IVeturisCancellationPeriod | IVeturisCancellationPeriod[];
    };
    PriceAgency: string;
    Price: string;
    Supplements?: {
        Supplement: IVeturisSupplement | IVeturisSupplement[];
    };
    Discounts?: {
        Discount: IVeturisDiscount | IVeturisDiscount[];
    };
}

export interface IVeturisCancellationPeriod {
    From: string;
    To: string;
    PriceAgency: string;
    Amount?: string;
}

export interface IVeturisSupplement {
    Description: string;
    Price: string;
    Type: string;
}

export interface IVeturisDiscount {
    Description: string;
    Price: string;
}

export interface IVeturisRawBookingResponse {
    BookingConfirmationRS: {
        ConfirmationStatus: string; // 1 = OK, 0 = Error
        BookingID?: string;
        SecurityCode?: string;
        Locator?: string;
        ERROR?: string;
        Errors?: {
            Error: {
                _: string;
                $: { type: string; field?: string };
            } | Array<{ _: string; $: { type: string; field?: string } }>;
        };
    };
}
