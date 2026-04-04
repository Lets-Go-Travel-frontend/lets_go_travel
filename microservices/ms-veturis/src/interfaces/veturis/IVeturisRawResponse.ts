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
        HotelDetails: {
            Name: string;
        };
        Rooms: {
            Room: {
                Refundable: string;
                Cancellation: {
                    Period: {
                        From: string;
                        To: string;
                        PriceAgency: string;
                    } | Array<{
                        From: string;
                        To: string;
                        PriceAgency: string;
                    }>;
                };
                PriceAgency: string;
                Price: string;
            } | Array<{
                Refundable: string;
                Cancellation: {
                    Period: any; 
                };
                PriceAgency: string;
                Price: string;
            }>;
        };
        EssentialInformation?: {
            Information: {
                Description: string;
            } | Array<{ Description: string }>;
        };
        MandatoryPaxes?: 'Y' | 'N' | 'H';
        PriceChange?: string;
        Error?: string;
        ERROR?: string;
        PriceAgency: string;
    };
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
