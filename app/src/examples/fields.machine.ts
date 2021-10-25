import {spawn, ActorRef} from 'xstate';
import {nanoid} from 'nanoid';
import {createFieldMachine} from './fieldItem.machine';
import {createModel} from 'xstate/lib/model';
import {capitalize} from "lodash";

const toComponentName = (as: string) => {
    let component
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
        'section': () => component = `SchemaForm`,
        'row': () => component = `SchemaRow`,
        'column': () => component = `SchemaColumn`,
        'default': () => component = `${as}`
    }
    return (componentMap[as] || componentMap['default'])()
}


const createElement = (event: any) => {
    console.log('createElement', event)
    const {as} = event
    return {
        id: nanoid(),
        component: toComponentName(as),
    }
}

const createColumn = (event: any) => {
    const element = createElement(event)
    console.log('createColumn', element)
    return {
        id: nanoid(),
        component: 'SchemaColumn',
        data: [],
    }
}

const createRow = (event: string) => {
    return {
        id: nanoid(),
        component: 'SchemaRow',
        data: []
    }
}


interface Field {
    id: string;
    component: string;
}

const fieldsModel = createModel(
    {
        fields: [] as Field[],
    },
    {
        events: {
            'ELEMENT.DROP': (element: string, path: string) => ({element, path}),
            'NEW.FIELD.COMMIT': (value: string) => ({value}),
            'FIELD.COMMIT': (field: Field) => ({field: field}),
            'FIELD.DELETE': (id: string) => ({id}),
        }
    }
);

export const fieldsMachine = fieldsModel.createMachine({
        id: 'fields',
        context: fieldsModel.initialContext,
        initial: 'loading',
        states: {
            loading: {
                entry: fieldsModel.assign({
                    fields: (context) => {
                        return context.fields.map((field) => ({
                            ...field,
                            ref: spawn(createFieldMachine(field))
                        }));
                    }
                }),
                always: 'ready'
            },
            ready: {}
        },
        on: {
            'NEW.FIELD.COMMIT': {
                actions: [
                    fieldsModel.assign({
                        fields: (context, event: any) => {
                            const entry = event.as === 'row' ? createRow(event) : createColumn(event)
                            return context.fields.concat({
                                ...entry,
                            })
                        }
                    }),
                    'persist'
                ],
            },
            // 'FIELD.COMMIT': {
            //     actions: [
            //         fieldsModel.assign({
            //             fields: (context, event) =>
            //                 context.fields.map((field) => {
            //                     return field.id === event.field.id
            //                         ? {...field, ...event.field, ref: field.ref}
            //                         : field;
            //                 })
            //         }),
            //         'persist'
            //     ]
            // },
            'FIELD.DELETE': {
                actions: [
                    fieldsModel.assign({
                        fields: (context, event) =>
                            context.fields.filter((field) => field.id !== event.id)
                    }),
                    'persist'
                ]
            },
        }
    },
    {
        actions: {
            persist: (ctx, evt) => console.log('persist', ctx, evt)
        }
    }
);
