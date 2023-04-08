import { HttpStatusCode } from '../constants';
import * as entities from '../entities/databaseEntities';
import * as models from '../models/apiModels';
import { validateObject, ValidateSchema, ValidationResponse } from '../services/util';

export const entitytoResponseModel = (category: entities.Category): models.Category=> {
    const result: models.Category= {
        id: category.id,
        name: category.name,
        description: category.description,
    };

    return result;
};

export const createRequestToEntity = (category: models.CategoryCreateRequest, id: string): ValidationResponse<entities.Category> => {
    const response: ValidationResponse<entities.Category> = {
        data: undefined, 
        errorMessage: '',
        statusCode: 0,
    };

    const schema: ValidateSchema<models.CategoryCreateRequest> = {
        name: 'string',
        description: 'string',
    };

    const valid = validateObject(category, schema);

    if (valid.statusCode !== HttpStatusCode.OK) {
        response.statusCode = HttpStatusCode.BadRequest;
        response.errorMessage = valid.errorMessage;
        return response;
    }

    const result: entities.Category= {
        id,
        name: category.name,
        description: category.description,
    };

    response.data = result;
    response.statusCode = HttpStatusCode.OK;
    return response;

}

export const updateRequestToEntity = (category: models.CategoryUpdateRequest, id: string): entities.Category => {
    const result: entities.Category = {
        id, 
        name: category.name!,
        description: category.description!,
    };

    return result;
}
