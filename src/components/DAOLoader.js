import React, { useCallback, useState } from 'react'
import { TextInput, textStyle } from '@aragon/ui'
import useDAO from '../hooks/useDAO'

export default function DAOLoader() {
  const [daoAddress, setDAOAddress] = useState('')
  const [apps] = useDAO(daoAddress)

  const handleDAOAddressChange = useCallback(event => {
    const newDAOAddress = event.target.value
    setDAOAddress(newDAOAddress)
  }, [])

  console.log('apps', apps)
  // console.log('apps', apps)

  return (
    <div>
      <h2
        css={`
          ${textStyle('title2')};
        `}
      >
        DaoLoader
      </h2>
      <TextInput
        label="Dao address"
        value={daoAddress}
        onChange={handleDAOAddressChange}
      />
    </div>
  )
}
