import React from "react";
const CustomerList = ({ customers, editCustomer, deleteCustomer }) => {
return (
<table className="table table-hover mt-3" align="center">
<thead className="thead-light">
<tr>
<th scope="col">Nº</th>
<th scope="col">Firstname</th>
<th scope="col">Lastname</th>
<th scope="col">Identity Ref</th>
<th scope="col">Username</th>
<th scope="col">Option</th>
</tr>
</thead>
{customers.map((customer, index) => {
return (
<tbody key={customer.id}>
<tr>
<td>{customer.id}</td>
<td>{customer.firstname}</td>
<td>{customer.lastname}</td>
<td>{customer.identityRef}</td>
<td>{customer.username}</td>
<td>
<button
type="button"
className="btn btn-warning"
onClick={() => editCustomer(customer)}
>
Edit
</button>
<button
type="button"
className="btn btn-danger mx-2"
onClick={() => deleteCustomer(customer.identityRef)}
>
Delete
</button>
</td>
</tr>
</tbody>
);
})}
</table>
);
};
export default CustomerList;