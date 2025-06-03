import api from "@/api";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { IoMusicalNotes, IoPause, IoPlay } from "react-icons/io5";
import { MdQueueMusic } from "react-icons/md";
import { BorderBeam } from "../magicui/border-beam";
import { ShineBorder } from "../magicui/shine-border";
interface MusicPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  musicFileId?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicFileId,
  className,
  ...props
}) => {
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicUrl = useRef<string | null>(null);

  useEffect(() => {
    if (musicFileId) {
      setIsLoading(true);
      api.file.fetchFile(musicFileId).then((file) => {
        const newFile = new File([file], "music.mp3", { type: "audio/mp3" });
        setMusicFile(newFile);

        // 파일을 URL로 변환하여 오디오 요소에 설정
        if (musicUrl.current) {
          URL.revokeObjectURL(musicUrl.current);
        }
        musicUrl.current = URL.createObjectURL(newFile);

        setIsLoading(false);
      });
    }

    // 컴포넌트 언마운트 시 URL 정리
    return () => {
      if (musicUrl.current) {
        URL.revokeObjectURL(musicUrl.current);
      }
    };
  }, [musicFileId]);

  // 재생 상태 변경 시 오디오 요소 제어
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 오디오 진행 상태 업데이트
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  // 음악 로드 완료 상태: musicFileId가 있고 isLoading이 false일 때
  const isMusicLoaded = musicFileId && !isLoading;

  return (
    <div
      className={cn(
        "border p-4 rounded-md flex items-center gap-4 bg-white shadow-lg relative overflow-hidden",
        className
      )}
      onClick={() => {
        if (isMusicLoaded) {
          togglePlayPause();
        }
      }}
      {...props}
    >
      {!isMusicLoaded ? (
        <>
          <BorderBeam
            duration={6}
            size={80}
            className={"from-transparent via-red-500 to-transparent"}
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={80}
            className={"from-transparent via-blue-500 to-transparent"}
          />
        </>
      ) : (
        <>
          <ShineBorder shineColor={["#fb2c36", "#2b7fff"]} />
        </>
      )}

      {/* 오디오 요소 (숨김) */}
      <audio
        ref={audioRef}
        src={musicUrl.current || ""}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {isMusicLoaded ? (
        // 음악 재생 UI
        <>
          <IoMusicalNotes className={"size-5"} />
          <div className={"flex-1 flex flex-col gap-2"}>
            <div className={"text-sm text-gray-700"}>
              AI가 자동으로 생성한 음악이에요
            </div>
            {/* 진행률 표시 */}
            {musicFileId && (
              <div
                className={
                  "mt-1 w-full h-[2px] bg-gray-200 rounded overflow-hidden"
                }
              >
                <div
                  className={"h-full relative bg-black"}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
          <div>
            <button
              className={
                "size-7 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/40 transition-colors"
              }
            >
              {isPlaying ? <IoPause /> : <IoPlay />}
            </button>
          </div>
        </>
      ) : isLoading ? (
        // 로딩 중 스켈레톤 UI
        <>
          <div
            className={"size-5 rounded-full bg-gray-400 animate-pulse"}
          ></div>
          <div className={"flex-1 flex flex-col gap-2"}>
            <div className={"h-5 w-24 bg-gray-400 rounded animate-pulse"}></div>
            <div className={"h-3 w-40 bg-gray-400 rounded animate-pulse"}></div>
          </div>
          <div>
            <div
              className={"size-7 rounded-full bg-gray-400 animate-pulse"}
            ></div>
          </div>
        </>
      ) : (
        // 생성 전 상태 UI
        <div className={"flex-1 flex items-center gap-4"}>
          <div className={"flex-1 flex flex-col"}>
            <div className={"text-lg font-medium"}>음악 생성 중</div>
            <div className={"text-xs text-gray-500"}>
              AI가 음악을 만드는데 사용량에 따라 5분 이상 걸릴 수 있어요
            </div>
          </div>
          <div className={"text-2xl text-gray-600"}>
            <MdQueueMusic />
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
