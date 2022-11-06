// interface props {
//   count: number;
// }
import Image from 'next/image'
import logo from '../../assets/logo.svg'
import { api } from '../../lib/axios'
import { FormEvent, useState } from 'react'
import { countryList } from '../../lib/country-list'

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

  const [formState, setFormState] = useState({} as GameProps)

  console.log(formState)

  async function CreateGame(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/games', {
        date: formState.date,
        firstTeamCountryCode: formState.firstTeamCountryCode,
        secondTeamCountryCode: formState.secondTeamCountryCode
      })

      const { message } = response.data

      alert(message)

    } catch (err) {
      console.error(err)
      alert("Falha ao criar o bolão, tente novamente!")
    }
  }

  return (
    <div className='max-w-[1124px] text-center  h-screen mx-auto grid grid-cols-1 items-center gap-28'>
      <main className='justify-center flex flex-col align-middle items-center'>
        <Image
          src={logo}
          alt="Logo NLW Copa"
          quality={100}
        />
        <h1 className='mt-14 text-center text-white text-5xl font-bold leading-tight'>
          Criar jogo fofolol :D
        </h1>

        <form className='mt-10 flex flex-col items-center gap-2' onSubmit={CreateGame}>
          <input
            className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type={"datetime-local"}
            onChange={(e) => setFormState((state) => ({
              ...state,
              date: String(e.target.value + ':00.365Z')
            }))}
            required
            placeholder='DD/MM/AAAA HH:MMh'
          />

          <select className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' name='firstTeamCountryCode' onChange={(e) => {
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

          <select className='w-full flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' name='secondTeamCountryCode' onChange={(e) => {
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
          <button
            className='bg-yellow-500 flex-1 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700'
            type='submit'
          >
            CRIAR MEU JOGO
          </button>
        </form>



      </main>
    </div>
  )
}




export const getStaticProps = async () => {
  const [
    poolCountResponse,
    guessCountResponse,
    usersCountResponse
  ] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count")
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count,

    }
  }
}