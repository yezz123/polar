import type { Meta, StoryObj } from '@storybook/react'

import PublicLayout from '@/components/Layout/PublicLayout'
import Pledge from '../components/Pledge'
import { issue, org, repo } from './testdata'

const meta: Meta<typeof Pledge> = {
  title: 'Pages/Pledge',
  component: Pledge,
  args: {
    organization: org,
    repository: repo,
    issue: issue,
  },
}

export default meta

type Story = StoryObj<typeof Pledge>

export const Default: Story = {
  parameters: {
    chromatic: { viewports: [390, 1200] },
  },

  render: (args) => {
    return (
      <PublicLayout>
        <Pledge {...args} />
      </PublicLayout>
    )
  },
}
