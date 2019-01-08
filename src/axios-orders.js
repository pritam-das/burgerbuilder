import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-react-js.firebaseio.com/'
});

export default instance;
