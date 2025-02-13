import { getCentsInDollarString } from 'polarkit/money'
import { ChangeEvent } from 'react'

interface Props {
  id: string
  name: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: number
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
  value?: number
}

const MoneyInput = (props: Props) => {
  let { id, name, onChange, placeholder } = props

  let other: {
    value?: string
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
  } = {}
  if (props.value) {
    other.value = getCentsInDollarString(props.value)
  }
  other.onBlur = props.onBlur

  return (
    <>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          className="block w-full rounded-lg border-gray-200 bg-transparent py-2 px-4 pl-7 pr-16 text-lg placeholder-gray-400 shadow-sm focus:z-10 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-100 dark:border-gray-600 dark:focus:border-blue-600 dark:focus:ring-blue-700/40"
          onChange={onChange}
          placeholder={getCentsInDollarString(props.placeholder)}
          {...other}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center pl-3 text-lg">
          <span className="text-gray-500">$</span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center pr-4 text-sm">
          <span className="text-gray-500">USD</span>
        </div>
      </div>
    </>
  )
}

export default MoneyInput
