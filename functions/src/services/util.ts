import { HttpStatusCode } from "../constants";

export type ValidateSchema<T> = Record<keyof T, string>;
export interface ValidationResponse<T> {
    data?: T; 
    errorMessage: string;
    statusCode: number;
} 

type ValidationErrorMap = {
    statusCode: number; 
    errorMessage: string;
}

export const validateObject = <T>(object: any, schema: ValidateSchema<T>): ValidationErrorMap => {
    let response: ValidationErrorMap = {
        statusCode: HttpStatusCode.OK,
        errorMessage: '',
    };

    const errors: string[] = []

    Object.keys(schema)
        .filter(key => object[key] === undefined)
        .map(key => key as keyof T)
        // eslint-disable-next-line array-callback-return
        .map((key) => {
                errors.push(String(key).toUpperCase());
            });

    if (errors.length > 0) {
        response.statusCode = HttpStatusCode.BadRequest;
        response.errorMessage = `Missing properties from request: ${errors.join(', ')}`;
    }

    return response;
};
