let Url = 'http://192.168.1.8:8000/';

// let baseProductApi = 'Product';

export const environment = {
    getAllProduct: Url + 'Product',
    postProduct: Url + 'Product',
    deleteProduct: Url + 'ProductList/',
    updateProduct: Url + 'ProductUpdate/',


    getAllVendorList: Url + 'Vendor',
    addVendor: Url + 'Vendor',
    deleteVendor: Url + 'Vendor/',
    updateVendor: Url + 'VendorUpdate/',
    updateBank: Url + 'Bank/',

    login: Url + 'auth/login',
    verifiedID: Url + 'auth/login',

    getAllCustomerList: Url + 'Customer',
    addCustomer: Url + 'Customer',
    deleteCustomer: Url + 'Customer/',
    updateCustomer: Url + 'CustomerUpdate/',
    updateAddress: Url + 'Address/',
};
