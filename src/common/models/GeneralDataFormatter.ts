import { DescribableField, FieldLinkMaker, FieldLinkModel, FieldMaker } from './field'
import { Raw_FieldLink, Raw_ModelField } from './auto-build'
import { ModelFullMetadata } from './ModelFullMetadata'

export class GeneralDataFormatter {
  public static formatModelField(rawData: Raw_ModelField) {
    return new FieldMaker(rawData).getFieldModel()
  }

  public static makeDescribableFields(modelFields: Raw_ModelField[], links: FieldLinkModel[] = []): DescribableField[] {
    modelFields = modelFields.filter((item) => !item.isHidden)
    return modelFields.reduce((prev, cur) => {
      const maker = new FieldMaker(cur)
      maker.setLinks(links)
      return prev.concat(maker.getDescribableFields())
    }, [] as DescribableField[])
  }

  public static makeDescribableFieldsFromMetadata(metadata: ModelFullMetadata) {
    const fieldLinks = metadata.fieldLinks.map((rawData) => new FieldLinkMaker(rawData).getLinkModel())
    return GeneralDataFormatter.makeDescribableFields(metadata.modelFields, fieldLinks)
  }

  public static formatFieldLink(rawData: Raw_FieldLink) {
    return new FieldLinkMaker(rawData).getLinkModel()
  }
}
