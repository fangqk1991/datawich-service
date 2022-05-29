import { Descriptor } from '@fangcha/tools'

export enum FilterSymbol {
  IN = 'IN',
  EQ = '=',
  GE = '>=',
  LE = '<=',
  GT = '>',
  LT = '<',
}

const values = [FilterSymbol.IN, FilterSymbol.EQ, FilterSymbol.GE, FilterSymbol.LE, FilterSymbol.GT, FilterSymbol.LT]

const describe = (code: FilterSymbol) => {
  return code
}

export const FilterSymbolDescriptor = new Descriptor(values, describe)
