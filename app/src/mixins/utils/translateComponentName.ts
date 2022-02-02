export function translateComponentName(alias: string) {
    let component: string
    const map: any = {
        'legend': () => component = 'FormLegend',
        'text': () => component = 'FormText',
        'number': () => component = 'FormNumber',
        'color': () => component = 'FormColor',
        'file': () => component = 'FormFile',
        'table': () => component = 'FormTable',
        'radio': () => component = 'FormRadio',
        'checkbox': () => component = 'FormCheckbox',
        'checklist': () => component = 'FormChecklist',
        'select': () => component = 'FormSelect',
        'schema': () => component = `SchemaForm`,
        'default': () => component = `${alias}`
    }
    return (map[alias] || map['default'])()
}

export function translateComponentType(alias: string) {
    let type: string
    const map: any = {
        'multiline': () => type = 'textarea',
        'date': () => type = 'date',
        'checkbox': () => type = 'checkbox',
        'text': () => type = 'text',
        'file': () => type = 'file',
        'default': () => type = `${alias}`
    }
    return (map[alias] || map['default'])()
}
