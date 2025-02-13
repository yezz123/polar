import { OrganizationPublicRead, type RepositoryRead } from '../../api/client'
import { githubRepoUrl } from '../../github'
import { GrayCard } from '../ui/Cards'

const abbrStars = (stars: number): string => {
  if (stars < 1000) {
    return stars.toString()
  }

  stars /= 1000
  return stars.toFixed(1) + 'k'
}

const prettyURL = (url: string): string => {
  if (url.indexOf('https://') === 0) {
    url = url.substring(8)
  }
  if (url.indexOf('http://') === 0) {
    url = url.substring(7)
  }
  return url
}

const RepositoryCard = ({
  organization,
  repository,
}: {
  organization: OrganizationPublicRead
  repository: RepositoryRead
}) => {
  const repoURL = githubRepoUrl(organization.name, repository.name)

  return (
    <>
      <GrayCard className="px-8 text-center">
        <div className="flex flex-row items-center justify-center space-x-2">
          <img
            className="h-8 w-8 rounded-full bg-white"
            src={organization.avatar_url}
            alt=""
          />
          <h2 className="text-lg font-normal">{repository.name}</h2>
        </div>
        <p className="my-3 text-sm font-normal text-gray-500">
          {repository.description}
        </p>
        <div className="flex flex-row items-center justify-center space-x-4">
          {typeof repository.stars === 'number' && (
            <p className="inline-flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">{abbrStars(repository.stars)}</span>
              <span>stars</span>
            </p>
          )}

          {repository.license && (
            <a
              className="whitespace-pre text-xs text-blue-600 dark:text-blue-500"
              href={repoURL}
            >
              {repository.license}
            </a>
          )}
          {!repository.license && (
            <a
              className="text-xs text-gray-600 dark:text-gray-400"
              href={repoURL}
            >
              Unknown license
            </a>
          )}

          {repository.homepage && (
            <a
              className="text-xs text-blue-600 dark:text-blue-500"
              href={repository.homepage}
            >
              {prettyURL(repository.homepage)}
            </a>
          )}
        </div>
      </GrayCard>
    </>
  )
}
export default RepositoryCard
