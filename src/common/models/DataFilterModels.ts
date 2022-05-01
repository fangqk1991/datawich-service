import { FilterSymbol } from './FilterSymbol'

export interface FilterCondition {
  leftKey: string
  symbol: FilterSymbol
  rightValue: number | string | (string | number)[]
}
