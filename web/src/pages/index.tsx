// interface props {
//   count: number;
// }
import Image from 'next/image'
import celulares from '../assets/celulares.png'
import logo from '../assets/logo.svg'
import avatares from '../assets/avatares.png'
import check from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'


interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}




export default function Home(props: HomeProps) {
  const [poolName, setPoolName] = useState("")
  const [poolCode, setPoolCode] = useState("")


  async function CreatePool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', { title: poolName })

      const { code } = response.data
      await navigator.clipboard.writeText(code)

      setPoolCode(code)

    } catch (err) {
      console.error(err)
      alert("Falha ao criar o bolão, tente novamente!")
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image
          src={logo}
          alt="Logo NLW Copa"
          quality={100}
        />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 gap-2 flex items-center '>
          <Image
            src={avatares}
            alt="Avatares de usuarios do aplicativo"
            quality={100}
          />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        {poolCode !== "" ?
          <div className='mt-10 flex  gap-2'>

            <strong className='text-2xl text-gray-100'>
              O codigo do seu bolão é <b className='text-3xl text-ignite-500'>{poolCode}</b>
            </strong>
            <button
              className='bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700'
              onClick={() => { setPoolCode("") }}
            >
              CRIAR NOVO BOLÃO
            </button>
          </div>
          :
          <form className='mt-10 flex items-center gap-2' onSubmit={CreatePool}>
            <input
              className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
              type={"text"}
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              required
              placeholder='Qual nome do seu bolão?'
            />
            <button
              className='bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700'
              type='submit'
            >
              CRIAR MEU BOLÃO
            </button>
          </form>
        }


        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>


        <div className='mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 grid grid-cols-2 text-gray-100'>
          <div className='flex-1 justify-start items-center gap-6 flex'>
            <Image
              src={check}
              alt=""
              quality={100}
            />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>
                +{props.poolCount}
              </span>
              <span>
                Bolões criados
              </span>
            </div>
          </div>

          <div className='flex-1 justify-end items-center gap-6 flex'>
            <Image
              src={check}
              alt=""
              quality={100}
            />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>
                +{props.guessCount}
              </span>
              <span>
                Palpites enviados
              </span>
            </div>
          </div>
        </div>

      </main>

      <figure>
        <Image
          src={celulares}
          alt="Dois celulares exibindo o aplicativo"
          quality={100}
        />
      </figure>
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