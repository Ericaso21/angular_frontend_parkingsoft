export interface User {
    token?: string,
    document_number?: string,
    pk_fk_id_document_type?: number,
    pk_fk_id_roles?: number,
    roles_users_status?: number,
    fk_id_gender?: number,
    name_user?: string,
    first_name?: string,
    second_name?: string,
    surname?: string,
    second_surname?: string,
    email?: string,
    password_user?: string,
    created_att?: Date,
    updated_att?: Date
}
