import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../hooks/UseAuth'

import { AppRoutes } from './app.routes'
import { SignIn } from '../screens/SignIn'
import { Box } from 'native-base'

export function Routes() {
  const { user } = useAuth()

  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        {user.name === undefined ?
          <SignIn />
          :
          <AppRoutes />
        }

      </NavigationContainer>
    </Box>
  )
}