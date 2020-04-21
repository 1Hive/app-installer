import AppSelector from '../AppRepoSelector/AppRepoSelector'
import DaoApps from '../Dao/DaoApps'
import DaoLoader from '../Dao/DaoLoader'
import AppConfiguration from './AppConfiguration'

export default [
  { Screen: DaoLoader },
  { Screen: DaoApps },
  { Screen: AppSelector },
  { Screen: AppConfiguration },
]
