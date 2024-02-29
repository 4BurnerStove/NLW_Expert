import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface newNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null 


export function NewNoteCard({ onNoteCreated }: newNoteCardProps) {
  const [shouldShowOnborading , setshouldShowOnborading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setshouldShowOnborading(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = (event.target.value)

    setContent(value)
    
    if (value === '') {
      setshouldShowOnborading(true)
    }

  }

  function handelSaveNote(event: FormEvent){
    event.preventDefault()

    if(content === ''){
      return
    }

    onNoteCreated(content)

    setContent('')
    setshouldShowOnborading(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window 

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a funcionalidade de gravação!')
      return
    }

    setIsRecording(true)
    setshouldShowOnborading(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1 
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition != null) {
      speechRecognition.stop()
    }
  }


  return ( 
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col text-left bg-slate-700 p-5 gap-3 hover:ring-slate-600 outline-none hover:ring-2 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>

        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'>
          <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none'>
            <Dialog.Close className=' absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5'/>
            </Dialog.Close>
              <form className='flex-1 flex flex-col'>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <span className='text-sm font-medium text-slate-300'>
                    Adicionar nota
                  </span>

                  { shouldShowOnborading  ? (
                    <p 
                      className='text-sm leading-6 text-slate-400'>
                      Comece <button 
                      type='button'
                      onClick={handleStartRecording}
                      className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button 
                      type='button'
                      onClick={handleStartEditor} 
                      className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                    </p>
                  ) : ( 
                    <textarea 
                      autoFocus 
                      className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                      onChange={handleContentChanged}
                      value={content}
                    ></textarea>
                    )}
                </div>
                  
                { isRecording ? (

                  <button 
                    onClick={handleStopRecording}
                    type='button'
                    className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
                    >
                    <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                    Gravando! (clique para interromper)
                  </button>
                ) : (
                  
                  <button 
                    type='button'
                    onClick={handelSaveNote}
                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
                    >
                    Salvar nota
                  </button>
                )} 

            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}