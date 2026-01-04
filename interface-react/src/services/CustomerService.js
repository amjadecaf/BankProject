import axios from "axios";
const CustomerService = axios.create({
baseURL: "http://localhost:8080/api/rest/customer",
});
export default CustomerService;