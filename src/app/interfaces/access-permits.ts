export interface AccessPermits {
    token: string,
    id_access_permits?: number,
    fk_id_roles?: number,
    fk_id_modules?: number,
    view_modules?: number,
    create_modules?: number,
    edit_modules?: number,
    delete_modules?: number,
    created_att?: Date,
    updated_att?: Date
}
