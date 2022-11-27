import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import * as fs from 'fs'
import { GeneralDataDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tiny.tmpl.ejs`

const generalDataGenerator = new ModelGenerator({
  dbConfig: GeneralDataDBOptions,
  tmplFile: modelTmpl,
})

const rootDir = `${__dirname}/../src/common/models/auto-build`

const generalDataSchemas: DBModelSchema[] = [
  {
    tableName: 'data_model',
    outputFile: `${rootDir}/Raw_DataModel.ts`,
  },
  {
    tableName: 'model_field',
    outputFile: `${rootDir}/Raw_ModelField.ts`,
  },
  {
    tableName: 'field_link',
    outputFile: `${rootDir}/Raw_FieldLink.ts`,
  },
  {
    tableName: 'field_group',
    outputFile: `${rootDir}/FieldGroupModel.ts`,
  },
  {
    tableName: 'field_index',
    outputFile: `${rootDir}/FieldIndexModel.ts`,
  },
  {
    tableName: 'model_field_action',
    outputFile: `${rootDir}/FieldActionModel.ts`,
  },
  {
    tableName: 'model_notify_template',
    outputFile: `${rootDir}/ModelNotifyTemplateModel.ts`,
  },
  {
    tableName: 'model_display_column',
    outputFile: `${rootDir}/ModelDisplayColumnModel.ts`,
  },
  {
    tableName: 'model_milestone',
    outputFile: `${rootDir}/ModelMilestoneModel.ts`,
  },
]

const main = async () => {
  for (const schema of generalDataSchemas) {
    const data = await generalDataGenerator.generateData(schema)
    generalDataGenerator.buildModel(schema, data)
  }

  const lines = [...generalDataSchemas].map((item) => {
    const className = (item.outputFile.split('/').pop() as string).split('.')[0]
    return `export * from './${className}'`
  })
  fs.writeFileSync(`${rootDir}/index.ts`, lines.join('\n') + '\n')

  process.exit()
}
main()
