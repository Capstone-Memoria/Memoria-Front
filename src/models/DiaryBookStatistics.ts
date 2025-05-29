export interface AttendanceRankingItem {
  userId: string;
  userNickname: string;
  diaryCount: number;
}

export interface CommentRankingItem {
  diaryId: number;
  diaryTitle: string;
  count: number;
}

export interface ReactionRankingItem {
  diaryId: number;
  diaryTitle: string;
  count: number;
}

export type EmotionWeather =
  | "SUNNY"
  | "NIGHT"
  | "RAINBOW"
  | "SNOWY"
  | "SUNNY"
  | "SUNNY_AND_CLOUDY"
  | "WINDY";

export interface DiaryBookStatistics {
  targetMonth: string;
  oneLineSummary: string;
  longSummary: string;
  emotionWeather: EmotionWeather;
  emotionWeatherReason: string;
  attendanceRanking: AttendanceRankingItem[];
  commentRanking: CommentRankingItem[];
  reactionRanking: ReactionRankingItem[];
}
