import { Text, Center, Icon } from 'native-base';
import { Fontisto } from '@expo/vector-icons'

import Logo from '../assets/logo.svg'
import { Button } from '../components/Button';

import { useAuth } from '../hooks/UseAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export function SignIn() {
  const { signIn, isUserLoading, user, setUser } = useAuth();
  const { navigate } = useNavigation()

  useEffect(() => {
    tryLogin()
  }, [user]);

  async function tryLogin() {
    try {
      const token = await AsyncStorage.getItem("@storage_Key:token");
      if (token !== null && !user?.name) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const userInfoResponse = await api.get("/me");

        setUser(userInfoResponse.data.user);
        navigate('pools')
      } else {

        console.log(token)
      }
    } catch (error) {
      try {
        await AsyncStorage.removeItem("@storage_Key:token");
        await AsyncStorage.removeItem("@storage_Key:user");
      } finally {
        // Faz o que quiser
      }
    }
  }

  return (
    <Center flex={1} bgColor="gray.900" p={7} >
      <Logo width={212} height={40} />

      <Button
        onPress={signIn}
        mt={12}
        title="Entrar com o google"
        type="SECUNDARY"
        isLoading={isUserLoading}
        leftIcon={
          <Icon as={Fontisto}
            name="google"
            color="white"
            size="md"></Icon>
        }
      />

      <Text
        color="gray.200"
        textAlign="center"
        mt={4}
      >
        Não utilizamos nenhuma informação além{'\n'}
        do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  );
}