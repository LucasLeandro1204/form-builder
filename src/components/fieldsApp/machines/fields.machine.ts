import {spawn, ActorRef} from 'xstate';
import {nanoid} from 'nanoid';
import {createFieldMachine} from './fieldItem.machine';
import {createModel} from 'xstate/lib/model';
// @ts-ignore
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
        'default': () => component = `${as}`
    }
    return (componentMap[as] || componentMap['default'])()
}

const createField = (as: string) => {
    return {
        id: nanoid(),
        component: toComponentName(as),
        label: capitalize(as),
    }
}

interface Field {
    id: string;
    component: string;
    label: string;
    ref: ActorRef<any>;
}

const fieldsModel = createModel(
    {
        fields: [] as Field[],
    },
    {
        events: {
            'NEW.FIELD.CHANGE': (value: string) => ({value}),
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
                        // "Rehydrate" persisted fields
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
                            const newField = createField(event.as);
                            return context.fields.concat({
                                ...newField,
                                ref: spawn(createFieldMachine(newField))
                            });
                        }
                    }),
                    'persist'
                ],
            },
            'FIELD.COMMIT': {
                actions: [
                    fieldsModel.assign({
                        fields: (context, event) =>
                            context.fields.map((field) => {
                                return field.id === event.field.id
                                    ? {...field, ...event.field, ref: field.ref}
                                    : field;
                            })
                    }),
                    'persist'
                ]
            },
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
