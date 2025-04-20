/**
 * SpringBoot 어플리케이션에 통상적으로 사용되는 Pagination Parameter들
 */
export interface PageParam {
  size?: number;
  page?: number;
}

interface Pageable {
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}

/**
 * Spring Boot Pagination과 연동하여 사용할 수 있는 Page 모델
 * @template T Page에 포함된 content 요소의 타입
 *
 * 참고: SpringBoot에서 응답으로 반환하는 Page객체의 PageNumber는 0부터 시작합니다.
 */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
