import { Descriptor } from '@fangcha/tools'

export enum FilterSymbol {
  IN = 'IN',
  NotIN = 'NotIN',
  EQ = '=',
  NE = '!=',
  GE = '>=',
  LE = '<=',
  GT = '>',
  LT = '<',
}

const values = [
  FilterSymbol.IN,
  FilterSymbol.NotIN,
  FilterSymbol.EQ,
  FilterSymbol.NE,
  FilterSymbol.GE,
  FilterSymbol.LE,
  FilterSymbol.GT,
  FilterSymbol.LT,
]

const describe = (code: FilterSymbol) => {
  return code
}

export const FilterSymbolDescriptor = new Descriptor(values, describe)
