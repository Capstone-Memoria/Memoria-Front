import type { Meta, StoryObj } from "@storybook/react";

import { FaSearch } from "react-icons/fa";
import Input from "./Input";

const meta = {
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
    icon: (
      <div>
        <FaSearch />
      </div>
    ),
  },
};

export const Icon: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
  },
};

export const HelperText: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
    helperText: "텍스트를 입력해주세요",
  },
};

export const Labeled: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
    label: "이메일",
  },
};

export const Required: Story = {
  args: {
    placeholder: "텍스트를 입력해주세요",
    label: "이메일",
    required: true,
  },
};

export const White: Story = {
  args: {
    variant: "white",
  },
};
