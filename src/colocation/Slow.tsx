const sleep = (time: number) => {
  const done = Date.now() + time
  while (done > Date.now()) {
    // sleep
  }
}

interface SlowProps {
  time: number
  onChange: (value: number) => void
}

const Slow = ({ time, onChange }: SlowProps) => {
  sleep(time)

  return (
    <div>
      Wow, that was&nbsp;
      <input value={time} type="number" onChange={e => onChange(Number(e.target.value))} />
      ms slow
    </div>
  )
}

export default Slow
