
export interface Course {
  id: string;
  name: string;
  date: string;
  city: string;
  centerName: string;
  address: string;
  link: string;
  isRefresher: boolean;
}

export interface IshaCenter {
  name: string;
  address: string;
  phone: string;
}

export interface SearchParams {
  startDate: string;
  endDate: string;
  city: string;
  category: string;
  customKeyword?: string;
  isRefresher: boolean;
}

export interface GroundingMetadata {
  groundingChunks: {
    web: {
      uri: string;
      title: string;
    };
  }[];
}
