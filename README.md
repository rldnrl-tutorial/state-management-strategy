# State Management

## Server Cache vs UI State
- **Server Cache**: 실제로 서버에 저장되고 빠른 액세스를 위해 클라이언트에 저장하는 상태(user data 같은 상태)
- **UI State**: App의 Interactive 부분을 제어하기 위한 UI에서만 유용한 상태. (`Modal`에서 `isOpen` 같은 상태)

## React is state management library.

For example:

```tsx
import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)
  
  return (
    <>
      <button onClick={increment}>+</button>
      <span>{count}</span>
    </>
  )
}

const App = () => {
  return <Counter />
}
```

## Sharing state across components

```tsx
import { useState } from 'react'

interface CounterProps {
  onIncrementClick: () => void
}

const Counter = ({ onIncrementClick }: CounterProps) => {
  return <button onClick={increment}>+</button>
}

interface CountDisplayProps {
  count: number
}

const CountDisplay = ({ count }: CountDisplayProps) => {
  return <div>{count}</div>
}

const App = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)
  
  return (
    <div>
      <CountDisplay count={count} />
      <Counter onIncrementClick={increment} />
    </div>
  )
}
```

## Props Drilling Problem

### Use Composition
다른 컴포넌트(`Header`, `LeftNav`)를 렌더링하는 컴포넌트(`App`)를 만들고 다음과 같이 모든 곳에 `Props`를 연결하는 대신:

```tsx
import { useState } from 'react'

const App = () => {
  const [someState, setSomeState] = useState('some state')
  return (
    <>
      <Header someState={someState} onStateChange={setSomeState} />
      <LeftNav someState={someState} onStateChange={setSomeState} />
      {/* ... */}
    </>
  )
}
```

아래와 같이 조립할 수 있다:

```tsx
const App = () => {
  const [someState, setSomeState] = React.useState('some state')
  return (
    <>
      <Header
        logo={<Logo someState={someState} />}
        settings={<Settings onStateChange={setSomeState} />}
      />
      <LeftNav>
        <SomeLink someState={someState} />
        <SomeOtherLink someState={someState} />
        <Etc someState={someState} />
      </LeftNav>
      {/* ... */}
    </>
  )
}
```

### Use Context

```tsx
import { createContext, useContext, useState } from "react";

interface ICountProvider {
  count: number
  increment: () => void
}

const CountContext = createContext<ICountProvider>({
  count: 0,
  increment: () => {
  }
})

const useCounter = () => useContext(CountContext)

const Counter = () => {
  const { increment } = useCounter()
  return <button onClick={increment}>+</button>
}

const CountDisplay = ({count}: CountDisplayProps) => {
  const { count } = useCounter()
  return <div>{count}</div>
}

const App = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)

  return (
    <CountContext.Provider value={{count, increment}}>
      <CountDisplay/>
      <Counter/>
    </CountContext.Provider>
  )
}
```

## Colocation
### Colocation이란?
> 코드를 최대한 그것과 연관있는 곳에 위치 시켜라.

```tsx
function sleep(time) {
  const done = Date.now() + time
  while (done > Date.now()) {
    // sleep...
  }
}

const Slow = ({ time, onChange }) => {
  sleep(time)
  return (
    <div>
      Wow, that was{' '}
      <input
        value={time}
        type="number"
        onChange={e => onChange(Number(e.target.value))}
      />
      ms slow
    </div>
  )
}

const DogName = ({ time, dog, onChange }) => {
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={e => onChange(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : 'enter a dog name'}</p>
    </div>
  )
}

const App = () => {
  const [dog, setDog] = React.useState('')
  const [time, setTime] = React.useState(200)
  return (
    <div>
      <DogName time={time} dog={dog} onChange={setDog} />
      <SlowComponent time={time} onChange={setTime} />
    </div>
  )
}
```

위의 컴포넌트는 불필요한 렌더링을 일으킨다. 이런 것을 Colocate를 사용하여 성능을 개선할 수 있다. Colocate는 관련이 있는 것끼리 가까이 위치시키는 개념이다. `dog`은 `DogName`에만 쓰고 있는 컴포넌트다. 따라서 `DogName`에 위치시키는 게 더 좋다. 아래와 같은 폴더 구조로 만들 것이다. 

```
├── DogName
│   ├── DogFavoriteNumberDisplay.tsx
│   ├── DogInput.tsx
│   ├── DogName.tsx
```

그리고 다음과 같이 리팩토링을 할 것이다.

### DogFavoriteNumberDisplay.tsx

```tsx
interface DogFavoriteNumberDisplayProps {
  time: number
  dog: string
}

const DogFavoriteNumberDisplay = ({ time, dog }: DogFavoriteNumberDisplayProps) => {
  return <p>{dog ? `${dog}'s favorite number is ${time}` : "enter a dog name"}</p>
}

export default DogFavoriteNumberDisplay
```

### DogInput.tsx

```tsx
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
```

### DogName.tsx

```tsx
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
```

- 참고
  - [Managing React Application State Management - Talk by Kent C. Dodds](https://www.youtube.com/watch?v=zpUMRsAO6-Y)
  - [State Colocation will make your React app faster](https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster)