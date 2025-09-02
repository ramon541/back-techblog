interface IApiControllerBase<T> {
    create: T;
    get: T;
    getAll: T;
    update: T;
    delete: T;
}

interface IApiAuthControllerBase<T> {
    login: T;
}
