export interface Country {
    country: string;
    code: string;
  }
  
  export interface InternetStatistics {
    countryCode: string;
    rate_wb: number | null;
    year_wb: number | null;
    rate_itu: number | null;
    year_itu: number | null;
    users_cia: number | null;
    year_cia: number | null;
  }
  