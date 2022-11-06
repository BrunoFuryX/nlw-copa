// interface props {
//   count: number;
// }
import Image from 'next/image'
import logo from '../../assets/logo.svg'
import { api } from '../../lib/axios'
import { FormEvent, useEffect, useState } from 'react'
import { countryList } from '../../lib/country-list'
import { useRouter } from 'next/router'

import ptBR from 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}


interface GameProps {
  date: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  firstTeamCountryPoints?: string;
  secondTeamCountryPoints?: string;
}



export default function Home(props: HomeProps) {
  const router = useRouter()
  const [formState, setFormState] = useState({} as GameProps)

  const { id } = router.query

  const when = dayjs(formState.date).locale(ptBR).format('DD [de] MMMM [de] YYYY [às] HH:mm[h]')

  async function CreateGame(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/games/' + id, {
        date: formState.date,
        firstTeamCountryCode: formState.firstTeamCountryCode,
        secondTeamCountryCode: formState.secondTeamCountryCode,
        firstTeamCountryPoints: formState.firstTeamCountryPoints,
        secondTeamCountryPoints: formState.secondTeamCountryPoints,
      })

      const { message } = response.data

      alert(message)

    } catch (err) {
      console.error(err)
      alert("Falha ao criar o bolão, tente novamente!")
    }
  }


  async function GetGame(id: any) {
    const { data } = await api.get(`/games/${id}`)

    const {
      firstTeamCountryCode,
      secondTeamCountryCode,
      date,
      firstTeamCountryPoints,
      secondTeamCountryPoints
    } = data.game
    setFormState({
      secondTeamCountryCode,
      firstTeamCountryCode,
      date,
      firstTeamCountryPoints,
      secondTeamCountryPoints
    })
  }

  useEffect(() => {
    if (id) {
      GetGame(id)
    }
  }, [id])

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-1 items-center gap-28'>
      <main>
        <Image
          src={logo}
          alt="Logo NLW Copa"
          quality={100}
        />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Atualizar jogo fofolol :D
        </h1>

        <form className='mt-10 flex flex-col items-center gap-2' onSubmit={CreateGame}>
          <p className='text-white'>
            {when}
          </p>

          <div className='flex gap-4 items-center text-white text-5xl'>
            <select disabled value={formState.firstTeamCountryCode} className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' name='firstTeamCountryCode' onChange={(e) => {
              setFormState((state) => ({
                ...state,
                firstTeamCountryCode: e.target.value
              }))
            }}>
              <option value='' disabled={true}>Select an country</option>
              {countryList.map(e => {
                return (
                  <option key={e.code} value={e.code}>{e.name}</option>
                )
              })
              }
            </select>

            X
            <select disabled value={formState.secondTeamCountryCode} className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' name='secondTeamCountryCode' onChange={(e) => {
              setFormState((state) => ({
                ...state,
                secondTeamCountryCode: e.target.value
              }))
            }}>
              <option value='' disabled={true}>Select an country</option>
              {countryList.map(e => {
                return (
                  <option key={e.code} value={e.code}>{e.name}</option>
                )
              })
              }
            </select>

          </div>

          <div className='flex gap-4 items-center text-white text-5xl'>
            <input value={formState.firstTeamCountryPoints} className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' name='firstTeamCountryPoints' onChange={(e) => {
              setFormState((state) => ({
                ...state,
                firstTeamCountryPoints: e.target.value
              }))
            }} />

            X
            <input value={formState.secondTeamCountryPoints} className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' name='secondTeamCountryPoints' onChange={(e) => {
              setFormState((state) => ({
                ...state,
                secondTeamCountryPoints: e.target.value
              }))
            }} />

          </div>
          <button
            className='bg-yellow-500 flex-1 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700'
            type='submit'
          >
            ATUALIZAR JOGO
          </button>
        </form>



      </main>
    </div>
  )
}