interface DogFavoriteNumberDisplayProps {
  time: number
  dog: string
}

const DogFavoriteNumberDisplay = ({ time, dog }: DogFavoriteNumberDisplayProps) => {
  return <p>{dog ? `${dog}'s favorite number is ${time}` : "enter a dog name"}</p>
}

export default DogFavoriteNumberDisplay
