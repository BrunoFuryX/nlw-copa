import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';

import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useState, useCallback } from "react";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {

  const { navigate } = useNavigation();
  const [pools, setPools] = useState<PoolCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  async function fetchPools() {
    try {
      const { data } = await api.get('/pools')
      setPools(data.polls)
    } catch (err) {
      console.error(err)
      toast.show({
        title: 'Houve um erro ao adiquirir os dados',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools()
  }, []))

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

      {isLoading ?
        <Loading />
        :
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PoolCard
            data={item}
            onPress={() => navigate('details', { id: item.id })}
          />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 16 }}
          ListEmptyComponent={() => <EmptyPoolList />}
          px={5}
          mt={6}
        />
      }


    </VStack>
  )
}