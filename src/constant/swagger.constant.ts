export const SwaggerConstant = {
  NOT_EMPTY: 'Not empty',
  OPTIONAL: 'Optional',
  MIN_LENGTH_6: 'Minimum length 6 characters',
  MIN_VALUE: 'Minimum value ',

  MULTIPART_FORM_DATA: 'multipart/form-data',
  JSON_MEDIA_TYPE: 'application/json',

  // example =================================================================
  ADMIN_USERNAME_EX: 'admin',
  ADMIN_PASSWORD_EX: '112233',
  USERNAME_EX: 'nva611',
  PASSWORD_EX: '112233',
  FIRST_NAME_EX: 'An',
  LAST_NAME_EX: 'Nguyen',

  PRODUCT_ID_EX: '654c8abada1d8574f6cbd530',
  PRODUCT_DESC_EX: 'Product description',
  PRODUCT_IMAGE_EX:
    'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
  PRODUCT_NAME_EX: 'Product name',
  PRICE_EX: '6000',
  QUANTITY_EX: '6000',

  CATEGORY_NAME_EX: 'Category name',
  CATEGORY_IMAGE_EX:
    'https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg',

  OBJECT_ID_EX: '6546436a812191262e06c58a',
  ARRAY_OBJECT_ID_EX: ['6546436a812191262e06c58a', '6546436a812191262e06c53a'],

  USER_ID_EX: '654b91745c359051c355362a',

  ADDRESS_EX: 'Ho Chi Minh City',
  PHONE_NUMBER_EX: '0339930201',
  NOTE_EX: 'Note something',
  // summary for endpoint

  // Authentication =================================================================
  AUTH_LOGIN_SUM: 'Login to get token',
  AUTH_LOGIN_DESC: 'Return token',

  AUTH_SIGN_IN_SUM: 'Register new account',
  AUTH_REGISTER_DESC: 'Created new account and return token',

  // ORDER =================================================================
  ORDER_CREATE_SUM: 'Create order',
  ORDER_CREATE_DESC: 'Create new order',
  ORDER_GET_BY_USER_ID_AND_STATUS_SUM: 'Get orders by user id and status',
  ORDER_GET_BY_USER_ID_AND_STATUS_DESC: "Return orders's information",
  ORDER_GET_BY_ID_SUM: "Get order's details by  id ",
  ORDER_GET_BY_ID_DESC: "Return order's details",
};
