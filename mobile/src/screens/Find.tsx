import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { PoolCardProps } from "../components/PoolCard";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {

  const { navigate } = useNavigation()
  const [code, setCode] = useState('');
  const [pools, setPools] = useState<PoolCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  async function handleJoinPool() {
    try {
      setIsLoading(true)
      if (!code.trim()) {
        toast.show({
          title: 'Insira o codigo do bolão que deseja buscar',
          placement: 'top',
          bgColor: 'red.500',
        })
        setIsLoading(false)
        return;
      }

      await api.post('/pools/join', { code: code.toLocaleUpperCase() })
      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })
      navigate('pools')

    } catch (err) {
      console.error(err)
      if (err.reponse?.data?.status) {
        toast.show({
          title: err.reponse?.data?.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Houve um erro ao adiquirir os dados',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
      setIsLoading(false)
    }
  }

  return (
    <VStack
      flex={1}
      bgColor={"gray.900"}
    >
      <Header title="Buscar por código" showBackButton onShare={() => { }} />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily={"heading"} color="white" fontSize={"xl"} mb={8} textAlign={"center"}>
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder={"Qual o código do bolão?"}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        <Button title="BUSCAR BOLÃO" onPress={handleJoinPool} />

      </VStack>

    </VStack>
  )
}