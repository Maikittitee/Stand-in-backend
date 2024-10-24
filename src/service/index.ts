export function convertSubdoc(option: Object, fieldName: string = 'options') {
    const obj: {[key: string]: string} = {};

    for (const [key, value] of Object.entries(option)) {
        obj[fieldName + '.' + key] = value;
    }
    return obj;
}