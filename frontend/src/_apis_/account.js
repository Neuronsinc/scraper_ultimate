import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'; // Importar Axios
// utils
import fakeRequest from '../utils/fakeRequest';
import { verify, sign } from '../utils/jwt';
//
import mock from './mock';

// ----------------------------------------------------------------------

const JWT_SECRET = 'minimal-secret-key';
const JWT_EXPIRES_IN = '5 days';

let users = []; // Inicializar la variable users

// Realizar una solicitud GET para obtener los datos de usuario
axios
  .get(`${process.env.REACT_APP_APIBACKEND}/usarios`) // Reemplaza '/api/users' con la URL real de tu servidor
  .then((response) => {
    users = response.data; // Asignar los datos de usuario obtenidos a la variable users
  })
  .catch((error) => {
    console.error(error);
  }); // Aquí hacer el get y que de una vez imprima los resultados de los usuarios

async function usuarioss() {
  try {
    const response = await axios.get(`${process.env.REACT_APP_APIBACKEND}/usarios`);
    return response.data; // Retorna los datos de usuario obtenidos
  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que se pueda manejar en el código que llama a esta función
  }
}
async function obtenerUsuarios() {
  try {
    const usuarios = await usuarioss();
    console.log(usuarios); // Haz algo con los datos de usuario
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
}
// ----------------------------------------------------------------------

mock.onPost('/api/account/login').reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password } = JSON.parse(config.data);
    const user = users.find((_user) => _user.email === email);

    if (!user) {
      return [400, { message: 'Credenciales inválidas, por favor verificar.' }];
    }

    if (user.password !== password) {
      return [400, { message: 'Credenciales inválidas, por favor verificar.' }];
    }

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [200, { accessToken, user }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onPost('/api/account/register').reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password, firstName, lastName } = JSON.parse(config.data);
    let user = users.find((_user) => _user.email === email);

    if (user) {
      return [400, { message: 'Ya existe una cuenta con la dirección de correo electrónico proporcionada.' }];
    }

    user = {
      id: uuidv4(),
      displayName: `${firstName} ${lastName}`,
      email,
      password,
      photoURL: null,
      phoneNumber: null,
      country: null,
      address: null,
      state: null,
      city: null,
      zipCode: null,
      about: null,
      role: 'user',
      isPublic: true
    };

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [200, { accessToken, user }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/account/my-account').reply(async (config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: 'Authorization token missing' }];
    }

    const accessToken = Authorization.split(' ')[1];
    const data = verify(accessToken, JWT_SECRET);
    const userId = typeof data === 'object' ? data?.userId : '';
    const userss = await usuarioss(); // Espera a que se resuelva la promesa
    const user = userss.find((_user) => _user.id === userId);

    if (!user) {
      return [401, { message: 'Invalid authorization token' }];
    }

    return [200, { user }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});
