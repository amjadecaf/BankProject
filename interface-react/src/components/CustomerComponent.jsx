    import { useState } from "react";
import CustomerList from "./CustomerList";
import CustomerService from "../services/CustomerService";
const CustomerComponent = ({ load, customers }) => {
/* state definition */
const [id, setId] = useState("");
const [identityRef, setIdentityRef] = useState("");
const [firstname, setFirstname] = useState("");
const [lastname, setLastname] = useState("");
const [username, setUsername] = useState("");
const [messageInfo, setMessageInfo] = useState("");
const [messageError, setMessageError] = useState("");
async function save(event) {
event.preventDefault();
if (id) {
await CustomerService.put("/update/" + identityRef, {
lastname: lastname,
firstname: firstname,
identityRef: identityRef,
username: username,
}).then((result) => setMessageInfo("Customer updated with success"));
} else {
await CustomerService.post("/create", {
firstname: firstname,
lastname: lastname,
identityRef: identityRef,
username: username,
}).then((result) => setMessageInfo("Customer added with success"));
}
// reset state
setId("");
setFirstname("");
setLastname("");
setIdentityRef("");
setUsername("");
load();
setMessageError("");
}
async function editCustomer(customers) {
setFirstname(customers.firstname);
setLastname(customers.lastname);
setIdentityRef(customers.identityRef);
setUsername(customers.username);
setId(customers.id);
setMessageError("");
setMessageInfo("");
}
async function deleteCustomer(id) {
setMessageError("");
setMessageInfo("");
await CustomerService.delete("/delete/" + id)
.then((result) => {
setMessageInfo(result.data);
})
.catch((e) => {
console.log(e);
setMessageError(e.response.data.message);
});
load();
}
/* end handlers */
/* jsx */
return (
<div className="container mt-4">
<div className="container">
{messageError && (
<div className="alert alert-danger" role="alert">
{messageError}
</div>
)}
{messageInfo && (
<div className="alert alert-success" role="alert">
{messageInfo}
</div>
)}
</div>
<form>
<div className="form-group my-2">
<input
hidden
type="text"
className="form-control"
value={id}
onChange={(e) => setId(e.target.value)}
/>
<label>Lastname</label>
<input
type="text"
className="form-control"
value={lastname}
onChange={(e) => setLastname(e.target.value)}
/>
</div>
<div className="form-group mb-2">
<label>Firstname</label>
<input
type="text"
className="form-control"
value={firstname}
onChange={(e) => setFirstname(e.target.value)}
/>
</div>
<div className="row">
<div className="col-4">
<label>Identity Ref</label>
<input
type="text"
className="form-control"
value={identityRef}
onChange={(e) => setIdentityRef(e.target.value)}
/>
</div>
</div>
<div className="row">
<div className="col-4">
<label>Username</label>
<input
type="text"
className="form-control"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>
</div>
</div>
<div>
<button className="btn btn-primary m-4" onClick={save}>
Save
</button>
</div>
</form>
<CustomerList
customers={customers}
editCustomer={editCustomer}
deleteCustomer={deleteCustomer}
/>
</div>
);
};
export default CustomerComponent;