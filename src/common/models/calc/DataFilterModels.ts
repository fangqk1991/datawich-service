import { FilterSymbol, LogicSymbol } from './index'

export interface FilterCondition {
  leftKey: string
  symbol: FilterSymbol
  rightValue: number | string | (string | number)[]
}

export interface FilterExpression {
  logic?: LogicSymbol
  elements?: FilterExpression[]
  condition?: FilterCondition
}

export interface FilterExpression_0 extends FilterExpression {
  condition: FilterCondition
  logic?: never
  elements?: never
}

export interface FilterExpression_1 extends FilterExpression {
  logic: LogicSymbol
  elements: LogicExpression[]
  condition?: never
}

export type LogicExpression = FilterExpression_0 | FilterExpression_1
