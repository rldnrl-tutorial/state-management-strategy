import { useState } from "react";
import DogInput from "./DogInput";
import DogFavoriteNumberDisplay from "./DogFavoriteNumberDisplay";

interface DogNameProps {
  time: number
}

const DogName = ({ time }: DogNameProps) => {
  const [dog, setDog] = useState("")

  return (
    <div>
      <DogInput dog={dog} onChange={setDog} />
      <DogFavoriteNumberDisplay time={time} dog={dog} />
    </div>
  )
}

export default DogName