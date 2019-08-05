export interface Error {
    code: number;
    key: string;
    message: string;
}

export interface ErrorItem {
    key: string;
    message: string;
}

export interface Response {
    code: number;
    message: string;
    response: any;
    errors: Array<ErrorItem>;
}

export function ResponseTemplate(): Response {
    return {
        code: 200,
        message: '',
        response: null,
        errors: [],
    };
}

export function processErrors(errors: Array<Error>): Response {
    const response: Response = {
        code: 200,
        message: 'OK',
        response: {},
        errors: [],
    };

    for (let i = 0; i < errors.length; i++) {
        const error: Error = errors[i];
        response.code = error.code;
        response.message = Code(error.code);
        response.errors.push({ key: error.key, message: error.message, });
    }

    return response;
}

export function Code(index: number): string {
    if (index === 400) {
        return 'Problem with request';
    } else if (index === 403) {
        return 'Not allowed access';
    } else if (index === 500) {
        return 'Internal Server Error';
    } else {
        return 'There was an error';
    }
}

export function emptyKeys(body, keys: Array<string>): Array<Error> {
    const errors: Array<Error> = [];

    keys.forEach((key: string) => {
        if (!body[key]) {
            const newError: Error = {
                code: 400,
                key: key,
                message: `is required`,
            };

            errors.push(newError);
        }
    });

    return errors;
}