export const translateComponentName = (as: string) => {
    let component: string
    const componentMap: any = {
        'legend': () => component = 'FormLegend',
        'text': () => component = 'FormText',
        'number': () => component = 'FormNumber',
        'color': () => component = 'FormColor',
        'file': () => component = 'FormFile',
        'radio': () => component = 'FormRadio',
        'checkbox': () => component = 'FormCheckbox',
        'checklist': () => component = 'FormChecklist',
        'select': () => component = 'FormSelect',
        'schema': () => component = `SchemaForm`,
        'default': () => component = `${as}`
    }
    return (componentMap[as] || componentMap['default'])()
}
