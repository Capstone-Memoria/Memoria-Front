import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import SectionMessage from "./SectionMessage";

const meta = {
  component: SectionMessage,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className={"min-w-80"}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: "테스트 메시지",
    children: "테스트 메시지입니다.",
  },
};

export const Warn: Story = {
  args: {
    variant: "warn",
    title: "테스트 메시지",
    children: "테스트 메시지입니다.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "테스트 메시지",
    children: "테스트 메시지입니다.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "테스트 메시지",
    children: "테스트 메시지입니다.",
  },
};

export const Disposable: Story = {
  args: {
    variant: "success",
    title: "테스트 메시지",
    children: "테스트 메시지입니다.",
    disposable: true,
    onDispose: () => {
      fn();
    },
  },
};
