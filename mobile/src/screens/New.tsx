import { useState } from "react";
import { Heading, VStack, Text, useToast } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import Logo from "../assets/logo.svg"
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function New() {

  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)


  const { navigate } = useNavigation()
  const toast = useToast()

  async function handlePoolCreate() {
    if (!title.trim()) {
      return toast.show({
        title: 'Opa! Informe um nome para o seu bolão',
        placement: "top",
        bgColor: 'red.500'
      });
      // Alert.alert('Novo bolão!', 'Opa! Informe um nome para o seu bolão')
    }
    setLoading(true)


    try {
      const response = await api.post('/pools', {
        title
      })

      console.log(response.data)

      toast.show({
        title: `Bolão criado com sucesso, codigo: ${response.data.code}`,
        placement: "top",
        bgColor: 'green.500'
      });

      setTitle("")
      navigate('pools')
    } catch (err) {
      console.error(err)
      toast.show({
        title: 'Não foi possivel criar o bolão',
        placement: "top",
        bgColor: 'red.500'
      });
    } finally {
      setLoading(false)
    }


  }

  return (
    <VStack
      flex={1}
      bgColor={"gray.900"}
    >
      <Header title="Criar novo bolão" showExitButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading fontFamily={"heading"} color="white" fontSize={"xl"} my={8} textAlign={"center"}>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder={"Qual o nome do seu bolão?"}
          value={title}
          onChangeText={setTitle}
        />

        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePoolCreate}
          isLoading={loading}
        />

        <Text
          color={"gray.200"}
          fontSize={"sm"}
          px={10}
          textAlign={"center"}
          mt={4}
        >
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>

    </VStack>
  )
}