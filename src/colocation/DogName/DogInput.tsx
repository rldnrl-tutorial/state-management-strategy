interface DogInputProps {
  dog: string
  onChange: (value: string) => void
}

const DogInput = ( { dog, onChange }: DogInputProps ) => {
  return (
    <label>
      <span>Dog Name</span>
      <br />
      <input value={dog} onChange={e => onChange(e.target.value)} />
    </label>
  )
}

export default DogInput
