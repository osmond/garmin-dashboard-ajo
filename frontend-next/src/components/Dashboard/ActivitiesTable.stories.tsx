import type { Meta, StoryObj } from '@storybook/react';
import ActivitiesTable from './ActivitiesTable';

const meta: Meta<typeof ActivitiesTable> = {
  title: 'Dashboard/ActivitiesTable',
  component: ActivitiesTable,
};
export default meta;

export const Default: StoryObj<typeof ActivitiesTable> = {};
