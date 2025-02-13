import BalanceBadge from '@/components/Dashboard/Account/BalanceBadge'
import StripeOnboardingButton from '@/components/Dashboard/Account/StripeOnboardingButton'
import TopbarPill from '@/components/Shared/TopbarPill'
import { Visibility } from 'polarkit/api/client'
import { useOrganizationAccounts } from 'polarkit/hooks'
import { useStore } from 'polarkit/store'

const AccountTopbar = ({
  showSetupAccount,
}: {
  showSetupAccount: (_: boolean) => void
}) => {
  const currentOrg = useStore((state) => state.currentOrg)
  const accountQuery = useOrganizationAccounts(currentOrg?.name)
  const accounts = accountQuery.data

  const hasPublicRepos =
    currentOrg &&
    currentOrg.repositories &&
    currentOrg.repositories.some((r) => r.visibility === Visibility.PUBLIC)

  if (hasPublicRepos && accountQuery.isLoading) {
    return (
      <TopbarPill color="blue">
        <div className="h-6 w-14"></div>
      </TopbarPill>
    )
  } else if (accounts?.length === 1) {
    return (
      <>
        {!accounts[0].is_details_submitted && accounts[0].is_admin ? (
          <StripeOnboardingButton
            stripeId={accounts[0].stripe_id}
            showSetupAccount={showSetupAccount}
          />
        ) : (
          <BalanceBadge account={accounts[0]} />
        )}
      </>
    )
  } else if (hasPublicRepos) {
    return <StripeOnboardingButton showSetupAccount={showSetupAccount} />
  } else {
    return null
  }
}
export default AccountTopbar
