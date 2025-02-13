import Banner from '@/components/Banner/Banner'
import Icon from '@/components/Icons/Icon'
import Stripe from '@/components/Icons/Stripe'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { api } from 'polarkit/api'
import {
  AccountRead,
  OrganizationPrivateRead,
  Platforms,
  PledgeResources,
  PledgeState,
} from 'polarkit/api/client'
import { PrimaryButton } from 'polarkit/components/ui'
import { getCentsInDollarString } from 'polarkit/money'
import { classNames } from 'polarkit/utils'
import { useState } from 'react'
import { Modal as ModernModal } from '../../Modal'
import SetupAccount from '../SetupAccount'
import List from './List'

const Finance = (props: {
  org: OrganizationPrivateRead
  tab: 'current' | 'rewarded'
  pledges: PledgeResources[]
  accounts: AccountRead[]
}) => {
  const { org, tab, pledges, accounts } = props

  const refundedStates = [PledgeState.REFUNDED, PledgeState.CHARGE_DISPUTED]
  const inReviewStates = [
    PledgeState.CONFIRMATION_PENDING,
    PledgeState.DISPUTED,
    PledgeState.PENDING,
  ]
  const paidStates = [PledgeState.PAID]

  const currentPledges =
    pledges.filter((pr) => pr.pledge.state !== PledgeState.PAID) || []

  const currentPledgesAmount = currentPledges
    .filter((pr) => !refundedStates.includes(pr.pledge.state))
    .map((pr) => pr.pledge.amount)
    .reduce((a, b) => a + b, 0)

  const rewardedPledges =
    pledges.filter((pr) => pr.pledge.state === PledgeState.PAID) || []

  const rewardedPledgesAmount = rewardedPledges
    .map((pr) => pr.pledge.amount)
    .reduce((a, b) => a + b, 0)

  const tabPledges = tab === 'current' ? currentPledges : rewardedPledges

  const openIssues = tabPledges.filter(
    (pr) =>
      !paidStates.includes(pr.pledge.state) &&
      !refundedStates.includes(pr.pledge.state) &&
      !inReviewStates.includes(pr.pledge.state),
  )

  const refunded = tabPledges.filter((pr) =>
    refundedStates.includes(pr.pledge.state),
  )

  const inReview = tabPledges.filter((pr) =>
    inReviewStates.includes(pr.pledge.state),
  )

  const paid = tabPledges.filter((pr) => paidStates.includes(pr.pledge.state))

  return (
    <div className="flex flex-col space-y-8">
      <StripeBanner org={org} accounts={accounts} />

      <div className="flex space-x-8 px-2">
        <HeaderPill
          title="Current peldges"
          amount={currentPledgesAmount}
          active={props.tab === 'current'}
          href={`/finance/${org.name}`}
        />
        <HeaderPill
          title={`Rewarded to ${org.name}`}
          amount={rewardedPledgesAmount}
          active={props.tab === 'rewarded'}
          href={`/finance/${org.name}/rewarded`}
        />
        {false && (
          <HeaderPill
            title="Rewarded to contributors"
            amount={0}
            active={false}
            href={`/finance/${org.name}/contributors`}
          />
        )}
      </div>
      {paid.length > 0 && (
        <List
          pledges={paid}
          columns={['PAID_OUT_DATE']}
          title="Paid out"
          subtitle="Issue solved"
        />
      )}
      {inReview.length > 0 && (
        <List
          pledges={inReview}
          columns={['ESTIMATED_PAYOUT_DATE']}
          title="In review"
          subtitle="Issue solved"
        />
      )}
      {openIssues.length > 0 && (
        <List
          pledges={openIssues}
          columns={[]}
          title="Pledges on open issues"
          subtitle="Issue"
        />
      )}
      {refunded.length > 0 && (
        <List
          pledges={refunded}
          columns={['REFUNDED_DATE']}
          title="Refunds"
          subtitle="Issue"
        />
      )}
    </div>
  )
}

const HeaderPill = (props: {
  title: string
  amount: number
  active: boolean
  href: string
}) => {
  return (
    <Link
      href={props.href}
      className={classNames(
        props.active
          ? 'dark-ring-200 border bg-white shadow dark:bg-gray-600 dark:ring-1 dark:ring-gray-500'
          : ' bg-transparenthover:bg-gray-100/50 border dark:bg-gray-700 dark:ring-1 dark:ring-gray-800',
        'transition-background relative flex w-full max-w-[300px] flex-col rounded-xl py-4  px-5 duration-200',
      )}
    >
      <div className="text-gray dark:text-gray text-md flex-1 font-medium text-gray-500">
        {props.title}
      </div>
      <div className="text-3xl font-medium text-gray-900 dark:text-gray-300">
        ${getCentsInDollarString(props.amount, true)}
      </div>
      {props.active && (
        <>
          <Triangle />
          <div className="absolute left-1/2 bottom-0 -ml-6 h-2 w-12  bg-white dark:bg-gray-600"></div>
        </>
      )}
    </Link>
  )
}

export default Finance

const Triangle = () => (
  <svg
    width="27"
    height="15"
    viewBox="0 0 27 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -bottom-[12px] left-1/2 -ml-[14px] text-white dark:hidden dark:text-gray-600"
    style={{
      filter:
        'drop-shadow(0 1px 8px rgb(0 0 0 / 0.07)) drop-shadow(0 0.5px 2.5px rgb(0 0 0 / 0.16))',
    }}
  >
    <path
      d="M13.6641 15L0.673682 5.39648e-07L26.6544 -1.73166e-06L13.6641 15Z"
      fill="currentColor"
    />
  </svg>
)

const StripeBanner = (props: {
  org: OrganizationPrivateRead
  accounts: AccountRead[]
}) => {
  const { org, accounts } = props

  const goToStripeDashboard = async (account: AccountRead) => {
    const link = await api.accounts.dashboardLink({
      platform: Platforms.GITHUB,
      orgName: org.name,
      stripeId: account.stripe_id,
    })
    window.location.href = link.url
  }

  const goToStripeOnboarding = async (account: AccountRead) => {
    const link = await api.accounts.onboardingLink({
      platform: Platforms.GITHUB,
      orgName: org.name,
      stripeId: account.stripe_id,
    })
    window.location.href = link.url
  }

  const [showSetupModal, setShowSetupModal] = useState(false)

  const toggle = () => {
    setShowSetupModal(!showSetupModal)
  }

  if (accounts.length === 0) {
    return (
      <>
        <Banner
          color="default"
          right={
            <PrimaryButton
              size="small"
              onClick={(e) => {
                e.preventDefault()
                setShowSetupModal(true)
              }}
            >
              <span>Setup up stripe</span>
            </PrimaryButton>
          }
        >
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
          <span className="text-sm">
            You need to set up a <strong>Stripe account</strong> to receive
            payouts
          </span>
        </Banner>
        <ModernModal
          isShown={showSetupModal}
          hide={toggle}
          modalContent={
            <SetupAccount onClose={() => setShowSetupModal(false)} />
          }
        />
      </>
    )
  }

  if (accounts.length > 0 && !accounts[0].is_details_submitted) {
    return (
      <Banner
        color="default"
        right={
          <PrimaryButton
            size="small"
            onClick={(e) => {
              e.preventDefault()
              goToStripeOnboarding(accounts[0])
            }}
          >
            <span>Continue setup</span>
          </PrimaryButton>
        }
      >
        <Icon classes="bg-blue-500" icon={<Stripe />} />
        <span className="text-sm">
          You need to set up a <strong>Stripe account</strong> to receive
          payouts
        </span>
      </Banner>
    )
  }

  if (accounts.length > 0 && accounts[0].is_details_submitted) {
    return (
      <>
        <Banner
          color="muted"
          right={
            <button
              className="text-blue-500 dark:text-blue-600"
              onClick={(e) => {
                e.preventDefault()
                goToStripeDashboard(accounts[0])
              }}
            >
              Go to Stripe
            </button>
          }
        >
          <Icon classes="bg-blue-500" icon={<Stripe />} />
          <span className="text-sm">
            Payouts will be sent to Stripe account {accounts[0].stripe_id}
          </span>
        </Banner>
      </>
    )
  }

  return null
}
