import { VStack, Icon } from "native-base";
import { Octicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native'

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/UseAuth";

export function Pools() {

  const { navigate } = useNavigation();



  return (
    <VStack
      flex={1}
      bgColor={"gray.900"}
    >
      <Header title="Meus bolões" showExitButton />

      <VStack mt={6} pb={6} mx={5} borderBottomWidth={1} borderBottomColor={"gray.600"} alignItems="center">
        <Button
          mt={2}
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate("find")}
        />

      </VStack>

      <VStack mt={6} mx={5} alignItems="center">


      </VStack>

    </VStack>
  )
}