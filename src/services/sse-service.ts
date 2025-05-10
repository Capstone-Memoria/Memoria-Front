// src/services/sseService.ts
import { Notification } from "@/models/Notification";
import { AuthenticationStore } from "@/stores/AuthenticationStore";
import { useNotificationStore } from "@/stores/NotificationStore";
import { EventSourcePolyfill } from "event-source-polyfill";

let eventSource: EventSourcePolyfill | null = null;

const SSE_URL = "/api/notification/subscribe"; // 실제 서버의 SSE 엔드포인트로 변경

export const connectSSE = (): void => {
  // 이미 연결되어 있거나 연결 시도 중이면 중복 실행 방지
  if (
    eventSource &&
    (eventSource.readyState === EventSourcePolyfill.OPEN ||
      eventSource.readyState === EventSourcePolyfill.CONNECTING)
  ) {
    console.log("SSE connection already established or connecting.");
    return;
  }

  // Zustand 스토어의 액션을 가져옵니다.
  const { addNotification } = useNotificationStore.getState();

  const authStore = AuthenticationStore.getState();

  try {
    eventSource = new EventSourcePolyfill(SSE_URL, {
      heartbeatTimeout: 1500000,
      headers: {
        Authorization: `Bearer ${authStore.context?.accessToken}`,
      },
    });

    eventSource.onopen = () => {
      console.log("SSE connection opened successfully.");
    };

    eventSource.onmessage = (event) => {
      console.log("SSE event received:", event);
      try {
        if (event.type !== "message") {
          return;
        }

        const newNotification: Notification = JSON.parse(event.data);
        console.log("New SSE event Notification received:", newNotification);
        addNotification(newNotification); // 스토어에 알림 추가
      } catch (error) {
        console.error("Error parsing SSE event data:", error);
        // 파싱 오류에 대한 처리 (예: 오류 알림을 스토어에 추가)
      }
    };

    eventSource.onerror = (errorEvent) => {
      console.error("SSE connection error:", errorEvent);
      // 오류 발생 시 EventSource는 자동으로 재연결을 시도할 수 있습니다.
      // 명시적으로 닫고 싶다면 eventSource.close() 호출
      // 또는 재연결 로직을 커스텀하게 관리할 수 있습니다.
      if (eventSource) {
        eventSource.close(); // 오류 시 일단 닫고, 재연결은 상위 로직에서 관리 가능
      }
    };
  } catch (error) {
    console.error("Failed to create EventSource:", error);
  }
};

export const closeSSE = (): void => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log("SSE connection closed by client.");
  }
};

export const getSSEReadyState = (): number | null => {
  return eventSource ? eventSource.readyState : null;
};
