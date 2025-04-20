import type { Meta, StoryObj } from "@storybook/react";

import Card from "./Banner";

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "green",
    title: "Card Title",
    children: "Card Content",
  },
  render: (args) => (
    <div className={"w-70"}>
      <Card
        {...args}
        title={"우리 일기장은 어떤 일기장일까?"}
        children={"메모리아에게 일기장 분석받기"}
      />
    </div>
  ),
};
