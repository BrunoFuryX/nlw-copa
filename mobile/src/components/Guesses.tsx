import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [games, setGames] = useState<GameProps[]>([])

  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true)

      const { data } = await api.get('/pools/' + poolId + '/games')

      console.log(data.games)
      setGames(data.games)
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
          title: 'Houve um erro ao carregar os dados dos palpites',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    console.log("Game ID", gameId)
    console.log("Pool ID", poolId)
    try {
      setIsLoading(true)
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        toast.show({
          title: 'Informe o placar do palpite!',
          placement: 'top',
          bgColor: 'red.500',
        })
        return;
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: 'Palpite enviado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })
      fetchGames()
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
          title: 'Não foi possivel enviar o palpite, tente novamente!',
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}

      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{ pb: 16 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
