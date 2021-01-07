import React, {useState, useEffect} from 'react'
import WaveSurfer from 'wavesurfer.js'
import './App.css';

const App = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorderRef, setMediaRecorderRef] = useState(undefined)
  const [audioChunk, setAudioChunk] = useState([])

  const recordVoice = () => {
    setMediaRecorderRef(undefined)
    setAudioChunk([])
    if(!navigator.mediaDevices)
    {
      window.alert('Voice Recording is not supported')
      setIsRecording(false)
      return
    }
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)
        setMediaRecorderRef(mediaRecorder)
        mediaRecorder.start()

        mediaRecorder.addEventListener("dataavailable", (event) => {
          setAudioChunk([...audioChunk,event.data])
        });
      }).catch(e => {
        setIsRecording(false)
        setAudioChunk([])
        setMediaRecorderRef(undefined)
          window.alert('Please allow microphone access')
      })

  }

  const stopRecordingVoice = () => {
    if(mediaRecorderRef){
      mediaRecorderRef.stop()
    }
  }

  const playRecording = () => {
    const audioBlob = new Blob(audioChunk);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play()
    var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
  });
  wavesurfer.load(audioUrl)
  }

  useEffect(() => {
    if(mediaRecorderRef === undefined && isRecording === false){
      return 
    }
    if(isRecording === true){
      recordVoice()
    }else{
      stopRecordingVoice()
    }
  }, [isRecording])

  return (
    <div className="App">
      <button className="btn btn-primary" onClick={()=>setIsRecording(!isRecording)}>
        {
          isRecording ? 'Stop Recording' : 'Record Voice'
        }
      </button>
      {
        isRecording === false && mediaRecorderRef && (
          <button className="btn btn-primary" onClick={playRecording}>
            Play
          </button>
        )
      }
      <div id="waveform"></div>
    </div>
  )
}

export default App