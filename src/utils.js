import isIPFS from 'is-ipfs'
import { id } from 'ethers/utils'

const DUMMY_ROLE = id('DUMMY_ROLE')
const ANY_ENTITY = `0x${''.padEnd(40, 'f')}`

export const IPFS_ENDPOINT = 'https://ipfs.eth.aragon.network/ipfs'

const hasAppParamRef = (app, ref) =>
  Array.isArray(ref) ? ref.includes(app.appName) : ref === app.appName

const getPermissionAddressByRef = (daoApps, ref) => {
  return ref === 'any'
    ? ANY_ENTITY
    : daoApps.find(app => hasAppParamRef(app, ref)).proxyAddress
}

const getPermissionRoleByRef = (roles, role) => {
  return !role
    ? DUMMY_ROLE
    : roles.find(availableRole => availableRole.id === role).bytes
}

const getPermissionRoleByAppRef = (daoApps, role, ref) => {
  return !role
    ? DUMMY_ROLE
    : daoApps
        .find(app => hasAppParamRef(app, ref))
        .roles.find(appRole => appRole.id === role).bytes
}

// Note that we can get inint params from both installed apps and settings screens
export function parseInitParams(daoApps, appInitParams, settings) {
  return appInitParams
    .sort((p1, p2) => p1.position - p2.position)
    .map(param => {
      if (param.isApp) {
        return daoApps.find(app => hasAppParamRef(app, param.ref)).proxyAddress
      }

      return settings[param.ref]
    })
}

export function buildPermissionIntents(
  daoApps,
  permissions,
  selectedAppRoles,
  counterfactualAppAddr
) {
  const aclProxyAddress = daoApps.find(app => app.name.toLowerCase() === 'acl')
    .proxyAddress

  const createPermissionIntents = permissions.create.map(
    ({ entity, role, manager }) => {
      const roleBytes = getPermissionRoleByRef(selectedAppRoles, role)

      return [
        aclProxyAddress,
        'createPermission',
        [
          getPermissionAddressByRef(daoApps, entity),
          counterfactualAppAddr,
          roleBytes,
          getPermissionAddressByRef(daoApps, manager),
        ],
      ]
    }
  )

  if (!permissions.grant) {
    return createPermissionIntents
  }

  const grantPermissionIntents = permissions.grant.map(({ role, where }) => {
    const entity = counterfactualAppAddr
    const app = getPermissionAddressByRef(daoApps, where)
    const roleBytes = getPermissionRoleByAppRef(daoApps, role, where)

    return [aclProxyAddress, 'grantPermission', [entity, app, roleBytes]]
  })

  return [...createPermissionIntents, ...grantPermissionIntents]
}

// Validates that the DAO has the required apps installed in order to initialize the apps
// E.g. Redemptions needs a token manager and vault
export function validateDAO(daoApps, selectedApps) {
  let missingApp

  const ok = selectedApps
    .map(app => app.appInitParams?.filter(param => param.isApp) || [])
    .flat()
    .reduce((acc, param) => {
      const hasApp = daoApps.some(daoApp => hasAppParamRef(daoApp, param.ref))
      if (!hasApp) {
        missingApp = param.ref
      }

      return acc && hasApp
    }, true)

  if (ok) {
    return null
  }

  return `You need to have ${missingApp} installed`
}

export const getIpfsCidFromUri = string => {
  const ipfsCid = string.replace(/^ipfs:/, '')

  if (isIPFS.cid(ipfsCid) || isIPFS.cidPath(ipfsCid)) {
    return ipfsCid
  }

  return ''
}

export const getIPFSPath = (uri, relativePath) => {
  const ipfsCid = getIpfsCidFromUri(uri)

  if (ipfsCid) {
    return `${IPFS_ENDPOINT}/${ipfsCid}${relativePath}`
  }

  return ''
}
