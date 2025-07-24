import type { Meta, StoryObj } from '@storybook/react';
import GoalsRing from './GoalsRing';

const meta: Meta<typeof GoalsRing> = {
  title: 'Dashboard/GoalsRing',
  component: GoalsRing,
};
export default meta;

export const Default: StoryObj<typeof GoalsRing> = {};
export const CustomGoal: StoryObj<typeof GoalsRing> = {
  args: { goal: 5000 },
};
