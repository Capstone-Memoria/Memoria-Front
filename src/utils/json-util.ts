import { DateTime } from "luxon";

/**
 * JSON을 파싱하고, 파싱된 객체에서 value가 string이고, ISO형식의 날짜 문자열인 경우 DateTime 객체로 변환한다.
 * @param json 파싱할 json 문자열
 * @returns 파싱된 객체
 */
export function parseJsonWithDateTime(json: string): unknown {
  try {
    const parsed = JSON.parse(json);
    return parseDateTime(parsed);
  } catch (e) {
    return undefined;
  }
}

/**
 * 객체를 순회하며 value가 string이고, ISO형식의 날짜 문자열인 경우 DateTime 객체로 변환한다.
 * @param obj 변환할 객체
 * @returns 변환된 객체
 */
export function parseDateTime(obj: unknown): unknown {
  if (typeof obj === "string") {
    if (DateTime.fromISO(obj).isValid && obj.includes("T")) {
      return DateTime.fromISO(obj);
    }
  } else if (typeof obj === "object" && obj !== null) {
    const objRecord = obj as Record<string, unknown>;
    for (const key in objRecord) {
      objRecord[key] = parseDateTime(objRecord[key]);
    }
  } else if (Array.isArray(obj)) {
    obj = obj.map((item) => parseDateTime(item));
  }
  return obj;
}
