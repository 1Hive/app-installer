import isIPFS from 'is-ipfs'
const ANY_ENTITY = `0x${''.padEnd(40, 'f')}`

export const IPFS_ENDPOINT = 'https://ipfs.eth.aragon.network/ipfs'

// Note that we can get inint params from both installed apps and settings screens
export function parseInitParams(daoApps, appInitParams, settings) {
  return appInitParams
    .sort((p1, p2) => p1.priority < p2.priority)
    .map(param => {
      if (param.isApp) {
        return daoApps.find(app => hasAppParam(app, param)).proxyAddress
      }

      return settings[param.ref]
    })
}

const hasAppParam = (app, param) =>
  Array.isArray(param.ref)
    ? param.ref.includes(app.appName)
    : param.ref === app.appName

const getPermissionAddressByRef = (daoApps, ref) => {
  return ref === 'any'
    ? ANY_ENTITY
    : daoApps.find(app => ref === app.appName).proxyAddress
}

export function parsePermissionIntents(
  daoApps,
  permissions,
  roles,
  counterfactualAppAddr
) {
  const aclProxyAddress = daoApps.find(app => app.name.toLowerCase() === 'acl')
    .proxyAddress

  const createPermissionIntents = permissions.create.map(
    ({ entity, role, manager }) => {
      const roleBytes = roles.find(availableRole => availableRole.id === role)
        .bytes

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

  // const grantPermissionIntents = permissions.grant.map(
  //   ({ entity, role, manager }) => {
  //     const roleBytes = roles.find(availableRole => availableRole.id === role)
  //       .bytes

  //     return [
  //       aclProxyAddress,
  //       'grantPermission',
  //       [entity, counterfactualAppAddr, roleBytes, manager],
  //     ]
  //   }
  // )

  return createPermissionIntents
}

// Validates that the DAO has the required apps installed in order to initialize the apps
// E.g. Redemptions needs a token manager and vault
export function validateDAO(daoApps, selectedApps) {
  let missingApp

  const ok = selectedApps
    .map(app => app.appInitParams.filter(param => param.isApp))
    .flat()
    .reduce((acc, param) => {
      const hasApp = daoApps.some(daoApp => hasAppParam(daoApp, param))
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
