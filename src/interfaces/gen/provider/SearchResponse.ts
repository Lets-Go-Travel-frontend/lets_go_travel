// Original file: proto/provider.proto

import type { SearchResult as _provider_SearchResult, SearchResult__Output as _provider_SearchResult__Output } from '../provider/SearchResult';

export interface SearchResponse {
  'results'?: (_provider_SearchResult)[];
}

export interface SearchResponse__Output {
  'results': (_provider_SearchResult__Output)[];
}
