import { useEffect, useState } from "react";
import { Share } from 'react-native'
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string
}
export function Details(props) {
  const [optionSelected, setOptionSelected] = useState<'Guesses' | 'Ranking'>('Guesses')


  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()


  const [pool, setPool] = useState({} as PoolCardProps);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchPool() {
    try {
      const { data } = await api.get('/pools/' + id)
      setPool(data.poll)

      console.log(data.poll)
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
          title: 'Houve um erro ao carregar os dados do bolão',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      title: 'Codigo do bolão' + pool.title,
      message: pool.code
    });
  }

  useEffect(() => {
    fetchPool()
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack
      flex={1}
      bgColor={"gray.900"}
    >
      <Header title={pool.title} showBackButton showShareButton onShare={handleCodeShare} />

      {pool._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />

          <HStack bgColor={"gray.800"} p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'Guesses'}
              onPress={() => setOptionSelected('Guesses')}
            />
            <Option
              title="Ranking do Grupo"
              isSelected={optionSelected === 'Ranking'}
              onPress={() => setOptionSelected('Ranking')}
            />
          </HStack>

          {optionSelected === 'Guesses' ?
            <Guesses poolId={pool.id} code={pool.code} />
            : optionSelected === 'Ranking' ?
              <></>
              :
              <></>
          }
        </VStack>
        :
        <EmptyMyPoolList code={pool.code} />
      }



    </VStack>
  );
}