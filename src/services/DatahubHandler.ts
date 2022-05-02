import { logger } from '@fangcha/logger'
import { SQLBulkAdder, SQLModifier } from 'fc-sql'
import { makeUUID } from '@fangcha/tools'
import { _DataModel } from '../models/extensions/_DataModel'
import {
  DatahubColumnModel,
  DatahubLink,
  FieldType,
  ModelFieldModel,
  transferLabelsToTagsValue,
} from '../common/models'
import { _DatahubTable } from '../models/datahub-sync/_DatahubTable'
import { _DatahubTableLink } from '../models/datahub-sync/_DatahubTableLink'
import { _DatahubColumn } from '../models/datahub-sync/_DatahubColumn'
import { _DatahubColumnLink } from '../models/datahub-sync/_DatahubColumnLink'

export class DatahubHandler {
  private readonly _dataModel: _DataModel
  public readonly datahubLink!: DatahubLink

  public constructor(dataModel: _DataModel) {
    this._dataModel = dataModel
    const extrasData = dataModel.getExtrasData()
    this.datahubLink = extrasData.datahubLink || {
      engineKey: '',
      tableKey: '',
    }
  }

  private _datahubTable!: _DatahubTable
  public async getDatahubTable() {
    if (!this._datahubTable) {
      const datahubLink = this.datahubLink
      this._datahubTable = await _DatahubTable.findTable(datahubLink.engineKey, datahubLink.tableKey)
    }
    return this._datahubTable
  }

  private _datahubTableLink!: _DatahubTableLink
  public async getDatahubTableLink() {
    if (!this._datahubTableLink) {
      this._datahubTableLink = await _DatahubTableLink.prepareWithUid(this._dataModel.modelKey)
    }
    return this._datahubTableLink
  }

  public async getDatahubColumnModels() {
    const datahubTable = await this.getDatahubTable()
    const columns = await datahubTable.getDatahubColumns()
    const links = await this.getDatahubColumnLinks()
    const linkMap = links.reduce((result, cur) => {
      result[cur.columnKey] = cur
      return result
    }, {})
    return columns.map((column) => {
      const data = column.fc_pureModel() as DatahubColumnModel
      data.linked = !!linkMap[column.columnKey]
      data.linkField = linkMap[column.columnKey]?.childField || ''
      return data
    })
  }

  private _datahubColumnLinks!: _DatahubColumnLink[]
  private async getDatahubColumnLinks() {
    if (!this._datahubColumnLinks) {
      const searcher = new _DatahubColumnLink().fc_searcher()
      searcher.processor().addConditionKV('child_model', this._dataModel.modelKey)
      this._datahubColumnLinks = await searcher.queryFeeds()
    }
    return this._datahubColumnLinks
  }

  public async makeMultiLinks() {
    const fields = await this._dataModel.getFields()
    const tagFields = fields.filter(
      (field) => !field.isSystem && (field.fieldType === FieldType.Tags || field.fieldType === FieldType.MultiEnum)
    )
    return tagFields.map((field) => {
      return {
        tagField: field,
        label2ValueMap: field.label2ValueMap(),
      }
    })
  }

  public async loadLatestDatahubRecords(lazyMode = false) {
    const dataModel = this._dataModel
    const database = dataModel.dbSpec().database
    const modelTableName = dataModel.sqlTableName()
    const datahubTable = await this.getDatahubTable()
    const datahubTableName = datahubTable.sqlTableName()
    const latestProgress = await datahubTable.getLatestProgress()
    if (!latestProgress) {
      return
    }
    const tableLink = await this.getDatahubTableLink()
    if (lazyMode && new Date(tableLink.sampleDate).getTime() >= new Date(latestProgress.sampleDate).getTime()) {
      return
    }
    const datahubColumns: string[] = [`${datahubTableName}.__rid AS __rid`]
    const insertableCols: string[] = ['_data_id', '__rid']
    const datahubColumnLinks = await this.getDatahubColumnLinks()
    for (const link of datahubColumnLinks) {
      datahubColumns.push(`${datahubTableName}.${link.columnKey} AS ${link.childField}`)
      insertableCols.push(link.childField)
    }
    const searcher = database.searcher()
    searcher.setTable(datahubTableName)
    searcher.setColumns(datahubColumns)
    searcher.addConditionKV(`${datahubTableName}.__date`, latestProgress.sampleDate)
    const records = await searcher.queryList()
    const sqlChunk = 100
    const timestampFields = await dataModel.getNormalTimestampFields()
    const timestampKeys = timestampFields.map((field) => field.fieldKey)
    const start = Date.now()
    const tagLinks = await this.makeMultiLinks()

    const transferRawData = (rawData: any) => {
      const data = { ...rawData }
      for (const { tagField, label2ValueMap } of tagLinks) {
        let fieldValue = rawData[tagField.fieldKey]
        try {
          fieldValue = JSON.parse(fieldValue)
        } catch (e) {}
        if (tagField.fieldType === FieldType.Tags) {
          data[tagField.fieldKey] = Array.isArray(fieldValue)
            ? transferLabelsToTagsValue(fieldValue, label2ValueMap)
            : 0
        } else if (tagField.fieldType === FieldType.MultiEnum) {
          data[tagField.fieldKey] = Array.isArray(fieldValue)
            ? fieldValue
                .map((item) => label2ValueMap[item])
                .filter((item) => !!item)
                .join(',')
            : ''
        }
      }
      return data
    }

    const runner = database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      {
        const remover = database.remover()
        remover.transaction = transaction
        remover.setTable(modelTableName)
        remover.addSpecialCondition('1')
        await remover.execute()
      }

      for (let i = 0; i < records.length; i += sqlChunk) {
        const bulkAdder = new SQLBulkAdder(database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(modelTableName)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(insertableCols)
        bulkAdder.declareTimestampKey(...timestampKeys)
        bulkAdder.setMissingValue(null)
        for (let j = 0; j < sqlChunk && i + j < records.length; ++j) {
          const data = records[i + j]
          data['_data_id'] = makeUUID()
          bulkAdder.putObject(transferRawData(data))
        }
        await bulkAdder.execute()
      }
      {
        dataModel.fc_edit()
        dataModel.sampleDate = latestProgress.sampleDate
        await dataModel.updateToDB(transaction)

        tableLink.fc_edit()
        tableLink.sampleDate = latestProgress.sampleDate
        await tableLink.updateToDB(transaction)
      }
    })

    const duration = ((Date.now() - start) / 1000).toFixed(2)
    logger.info(`[${dataModel.modelKey}] loadLatestDatahubRecords, time elapsed: ${duration}s`)
  }

  /**
   * @description 执行耗时较长，暂不使用此方法
   * @param fieldData
   * @param datahubColumn
   */
  public async bindDatahubColumnBeta(fieldData: ModelFieldModel, datahubColumn: _DatahubColumn) {
    const dataModel = this._dataModel
    const field = await dataModel.createField(fieldData)
    const tableLink = await this.getDatahubTableLink()

    const columnLink = new _DatahubColumnLink()
    columnLink.childModel = field.modelKey
    columnLink.childField = field.fieldKey
    columnLink.engineKey = datahubColumn.engineKey
    columnLink.tableKey = datahubColumn.tableKey
    columnLink.columnKey = datahubColumn.columnKey
    await columnLink.addToDB()

    const database = dataModel.dbSpec().database
    const modelTable = dataModel.sqlTableName()
    const datahubTable = datahubColumn.sqlTableName()

    const searcher = database.searcher()
    searcher.setTable(datahubTable)
    searcher.setColumns(['__rid', datahubColumn.columnKey])
    searcher.addConditionKV(`__date`, tableLink.sampleDate)
    const records = await searcher.queryList()
    const label2ValueMap = field.label2ValueMap()
    const transferRawValue = (rawValue: string) => {
      if (field.fieldType === FieldType.Tags) {
        try {
          rawValue = JSON.parse(rawValue)
        } catch (e) {}
        if (!Array.isArray(rawValue)) {
          return 0
        }
        return transferLabelsToTagsValue(rawValue, label2ValueMap)
      }
      return rawValue
    }

    try {
      const runner = database.createTransactionRunner()
      await runner.commit(async (transaction) => {
        for (let i = 0; i < records.length; ++i) {
          const data = records[i]
          const rawValue = data[datahubColumn.columnKey]
          const modifier = new SQLModifier(database)
          modifier.transaction = transaction
          modifier.setTable(modelTable)
          modifier.updateKV(field.fieldKey, transferRawValue(rawValue))
          modifier.addConditionKV('__rid', data['__rid'])
          await modifier.execute()
        }
      })
    } catch (e) {
      // 数据更新失败将移除新建的字段
      await dataModel.deleteField(field)
      throw e
    }
  }

  public async bindDatahubColumn(fieldData: ModelFieldModel, datahubColumn: _DatahubColumn) {
    const dataModel = this._dataModel
    const field = await dataModel.createField(fieldData)

    const columnLink = new _DatahubColumnLink()
    columnLink.childModel = field.modelKey
    columnLink.childField = field.fieldKey
    columnLink.engineKey = datahubColumn.engineKey
    columnLink.tableKey = datahubColumn.tableKey
    columnLink.columnKey = datahubColumn.columnKey
    await columnLink.addToDB()

    const database = dataModel.dbSpec().database
    const modelTable = dataModel.sqlTableName()
    const datahubTable = datahubColumn.sqlTableName()

    const expression = field.fieldType === FieldType.Tags ? 0 : `${datahubTable}.${datahubColumn.columnKey}`
    const sql = `UPDATE ${modelTable}, ${datahubTable} SET ${modelTable}.${field.fieldKey} = ${expression} WHERE ${modelTable}.__rid = ${datahubTable}.__rid AND ${datahubTable}.${datahubColumn.columnKey} IS NOT NULL`
    try {
      await database.update(sql, [])
    } catch (e) {
      // 数据更新失败将移除新建的字段
      await dataModel.deleteField(field)
      throw e
    }
  }
}
