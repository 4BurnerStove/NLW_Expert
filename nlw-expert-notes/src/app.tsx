import logo from './assets/Logo.svg'

export function App() {
  return (
    <div className="mx-auto max-w-6xl my-12 ">
      <img src={logo} alt='Nlw Expert' />
    
      <form className="w-full">
        <input 
          type='text' 
          placeholder='Busce em suas notas...'
          className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500 " 
        />
      </form>
    </div>
  )
}

